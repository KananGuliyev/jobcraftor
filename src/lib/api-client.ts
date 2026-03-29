import type { ZodType } from "zod";
import { apiErrorResponseSchema } from "@/types/jobcraftor";

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
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "JobCraftorApiError";
    this.status = status;
    this.code = code;
  }
}

interface ReadJsonApiResponseOptions<T> {
  response: Response;
  schema: ZodType<T>;
  fallbackMessage: string;
  endpoint: string;
}

export async function readJsonApiResponse<T>(
  options: ReadJsonApiResponseOptions<T>,
): Promise<T> {
  const { response, schema, fallbackMessage, endpoint } = options;

  if (!isJsonResponse(response)) {
    const responseText = await response.text().catch(() => "");

    console.warn("[JobCraftor][client] expected JSON response but received non-JSON content", {
      endpoint,
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
    console.warn("[JobCraftor][client] failed to parse JSON response", {
      endpoint,
      status: response.status,
      contentType: response.headers.get("content-type"),
      error,
    });

    throw new JobCraftorApiError(fallbackMessage, response.status);
  }

  if (!response.ok) {
    const errorPayload = apiErrorResponseSchema.safeParse(parsedBody);

    throw new JobCraftorApiError(
      errorPayload.success ? errorPayload.data.error : extractErrorMessage(parsedBody) ?? fallbackMessage,
      response.status,
      errorPayload.success ? errorPayload.data.code : undefined,
    );
  }

  const schemaResult = schema.safeParse(parsedBody);

  if (!schemaResult.success) {
    console.warn("[JobCraftor][client] response JSON did not match the expected schema", {
      endpoint,
      status: response.status,
      issues: schemaResult.error.issues,
    });

    throw new JobCraftorApiError(fallbackMessage, response.status);
  }

  return schemaResult.data;
}
