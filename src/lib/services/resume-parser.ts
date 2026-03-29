import { normalizeResumeText } from "@/lib/resume-text";
import type { ParseResumeSuccess, ResumeUploadFormat } from "@/types/jobcraftor";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const supportedExtensions = new Map<string, ResumeUploadFormat>([
  [".txt", "txt"],
  [".md", "md"],
  [".rtf", "rtf"],
  [".pdf", "pdf"],
  [".docx", "docx"],
]);

const mimeToFormat = new Map<string, ResumeUploadFormat>([
  ["text/plain", "txt"],
  ["text/markdown", "md"],
  ["application/rtf", "rtf"],
  ["text/rtf", "rtf"],
  ["application/pdf", "pdf"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
]);

export class ResumeParseError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 400, code = "UPLOAD_PARSE_ERROR") {
    super(message);
    this.name = "ResumeParseError";
    this.status = status;
    this.code = code;
  }
}

function getFileExtension(fileName: string) {
  const normalized = fileName.toLowerCase();
  const lastDot = normalized.lastIndexOf(".");
  return lastDot >= 0 ? normalized.slice(lastDot) : "";
}

function detectResumeFormat(file: File): ResumeUploadFormat {
  const extension = getFileExtension(file.name);

  if (extension === ".doc") {
    throw new ResumeParseError(
      "Legacy `.doc` files are not supported here. For the safest result, paste your resume text or upload a `.docx` file.",
      415,
      "UPLOAD_UNSUPPORTED_FILE_TYPE",
    );
  }

  const fromExtension = supportedExtensions.get(extension);

  if (fromExtension) {
    return fromExtension;
  }

  const fromMime = mimeToFormat.get(file.type);

  if (fromMime) {
    return fromMime;
  }

  throw new ResumeParseError(
    "Please use a `.txt`, `.md`, `.rtf`, `.pdf`, or `.docx` resume file. For the safest demo, paste resume text or upload a `.docx` file.",
    415,
    "UPLOAD_UNSUPPORTED_FILE_TYPE",
  );
}

function validateResumeFile(file: File) {
  if (!file.size) {
    throw new ResumeParseError(
      "That file looks empty. Try another export, paste your resume text, or upload a `.docx` version.",
      400,
      "UPLOAD_EMPTY_FILE",
    );
  }

  if (file.size > MAX_RESUME_BYTES) {
    throw new ResumeParseError(
      "That file is too large to parse cleanly here. Please use a resume under 5 MB or paste the text directly.",
      413,
      "UPLOAD_FILE_TOO_LARGE",
    );
  }
}

function decodeTextBuffer(buffer: Buffer) {
  return new TextDecoder("utf-8", { fatal: false }).decode(buffer);
}

function decodeRtfHex(hex: string) {
  return Buffer.from(hex, "hex").toString("latin1");
}

function extractTextFromRtf(rtfText: string) {
  const withoutNewlines = rtfText.replace(/\r\n?/g, "\n");

  return withoutNewlines
    .replace(/\\par[d]?/gi, "\n")
    .replace(/\\line/gi, "\n")
    .replace(/\\tab/gi, " ")
    .replace(/\\'([0-9a-fA-F]{2})/g, (_, hex: string) => decodeRtfHex(hex))
    .replace(/\\u(-?\d+)\??/g, (_, value: string) => {
      const codePoint = Number.parseInt(value, 10);
      return Number.isNaN(codePoint) ? " " : String.fromCharCode((codePoint + 65_536) % 65_536);
    })
    .replace(/\\([{}\\])/g, "$1")
    .replace(/\\[a-z]+-?\d* ?/gi, " ")
    .replace(/[{}]/g, " ");
}

async function parsePdf(buffer: Buffer) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });

  try {
    const textResult = await parser.getText();
    return textResult.text;
  } finally {
    await parser.destroy();
  }
}

async function parseDocx(buffer: Buffer) {
  const mammothModule = await import("mammoth");
  const parser = mammothModule.default ?? mammothModule;
  const result = await parser.extractRawText({ buffer });
  return result.value;
}

async function extractResumeText(format: ResumeUploadFormat, buffer: Buffer) {
  switch (format) {
    case "txt":
    case "md":
      return decodeTextBuffer(buffer);
    case "rtf":
      return extractTextFromRtf(decodeTextBuffer(buffer));
    case "pdf":
      return parsePdf(buffer);
    case "docx":
      return parseDocx(buffer);
  }
}

function getMeta(format: ResumeUploadFormat, fileName: string): ParseResumeSuccess["meta"] {
  const labels: Record<ResumeUploadFormat, { sourceLabel: string; helperText: string }> = {
    txt: {
      sourceLabel: "Parsed text resume",
      helperText: "Text resume loaded successfully. Review the extracted text below and edit it if needed.",
    },
    md: {
      sourceLabel: "Parsed markdown resume",
      helperText: "Markdown resume loaded successfully. Review the extracted text below and edit it if needed.",
    },
    rtf: {
      sourceLabel: "Parsed RTF resume",
      helperText: "RTF resume loaded successfully. Review the extracted text below and edit it if needed.",
    },
    pdf: {
      sourceLabel: "Parsed PDF resume",
      helperText: "PDF text was extracted. Review it carefully before generating the plan, since some PDF exports can be inconsistent.",
    },
    docx: {
      sourceLabel: "Parsed DOCX resume",
      helperText: "DOCX content was extracted cleanly. Review the text below before generating the plan.",
    },
  };

  return {
    fileName,
    format,
    sourceLabel: labels[format].sourceLabel,
    helperText: labels[format].helperText,
  };
}

export async function parseResumeFile(file: File): Promise<ParseResumeSuccess> {
  validateResumeFile(file);

  const format = detectResumeFormat(file);
  const buffer = Buffer.from(await file.arrayBuffer());

  let extractedText = "";

  try {
    extractedText = await extractResumeText(format, buffer);
  } catch {
    const parseFailureMessage =
      format === "pdf"
        ? "We couldn't read that PDF cleanly. For the safest demo, paste your resume text or try a `.docx` export instead."
        : format === "docx"
          ? "We couldn't read that DOCX file cleanly. Try another export or paste your resume text directly."
          : `JobCraftor couldn't read this ${format.toUpperCase()} file. Please try a cleaner export or paste the resume text directly.`;

    throw new ResumeParseError(
      parseFailureMessage,
      422,
      "UPLOAD_PARSE_ERROR",
    );
  }

  const text = normalizeResumeText(extractedText);

  if (!text) {
    const noTextMessage =
      format === "pdf"
        ? "That PDF did not contain enough readable text. For the safest demo, paste your resume text or upload a `.docx` file."
        : "We couldn't find enough readable text in that file. Try another export or paste the resume text directly.";

    throw new ResumeParseError(
      noTextMessage,
      422,
      "UPLOAD_NO_READABLE_TEXT",
    );
  }

  return {
    text,
    meta: getMeta(format, file.name),
  };
}
