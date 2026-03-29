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
      "Legacy `.doc` files are not supported yet. Please upload a `.docx`, PDF, or paste the resume text.",
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
    "Upload a supported resume file: `.txt`, `.md`, `.rtf`, `.pdf`, or `.docx`. You can also paste the resume text directly.",
    415,
    "UPLOAD_UNSUPPORTED_FILE_TYPE",
  );
}

function validateResumeFile(file: File) {
  if (!file.size) {
    throw new ResumeParseError(
      "The uploaded file is empty. Please choose a resume with readable content.",
      400,
      "UPLOAD_EMPTY_FILE",
    );
  }

  if (file.size > MAX_RESUME_BYTES) {
    throw new ResumeParseError(
      "The uploaded file is too large. Please use a resume under 5 MB or paste the text directly.",
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
      helperText: "Text resume parsed successfully. Review the extracted text below and edit it if needed.",
    },
    md: {
      sourceLabel: "Parsed markdown resume",
      helperText: "Markdown resume parsed successfully. Review the extracted text below and edit it if needed.",
    },
    rtf: {
      sourceLabel: "Parsed RTF resume",
      helperText: "RTF resume parsed successfully. Review the extracted text below and edit it if needed.",
    },
    pdf: {
      sourceLabel: "Parsed PDF resume",
      helperText: "PDF text was extracted and normalized. Review the text below before generating the plan.",
    },
    docx: {
      sourceLabel: "Parsed DOCX resume",
      helperText: "DOCX content was extracted and normalized. Review the text below before generating the plan.",
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
    throw new ResumeParseError(
      `JobCraftor could not read this ${format.toUpperCase()} file. Please try a cleaner export, a different format, or paste the resume text directly.`,
      422,
      "UPLOAD_PARSE_ERROR",
    );
  }

  const text = normalizeResumeText(extractedText);

  if (!text) {
    throw new ResumeParseError(
      "JobCraftor could not extract readable text from that file. Try another export, copy the resume into plain text, or paste it directly.",
      422,
      "UPLOAD_NO_READABLE_TEXT",
    );
  }

  return {
    text,
    meta: getMeta(format, file.name),
  };
}
