import type { ZodType } from "zod";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractErrorMessage(value: unknown) {
  if (isRecord(value) && typeof value.error === "string" && value.error.trim()) {
    return value.error;
  }

  return null;
}

function isJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  return contentType.includes("application/json");
}

export class JobCraftorApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "JobCraftorApiError";
    this.status = status;
  }
}

export async function readJsonApiResponse<T>(
  response: Response,
  schema: ZodType<T>,
  fallbackMessage: string,
): Promise<T> {
  if (!isJsonResponse(response)) {
    const responseText = await response.text().catch(() => "");

    console.error("[JobCraftor][client] expected JSON response but received non-JSON content", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      bodySnippet: responseText.slice(0, 160),
    });

    throw new JobCraftorApiError(fallbackMessage, response.status);
  }

  let parsedBody: unknown;

  try {
    parsedBody = await response.json();
  } catch (error) {
    console.error("[JobCraftor][client] failed to parse JSON response", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      error,
    });

    throw new JobCraftorApiError(fallbackMessage, response.status);
  }

  if (!response.ok) {
    throw new JobCraftorApiError(extractErrorMessage(parsedBody) ?? fallbackMessage, response.status);
  }

  const schemaResult = schema.safeParse(parsedBody);

  if (!schemaResult.success) {
    console.error("[JobCraftor][client] response JSON did not match the expected schema", {
      status: response.status,
      issues: schemaResult.error.issues,
    });

    throw new JobCraftorApiError(fallbackMessage, response.status);
  }

  return schemaResult.data;
}
