import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import {
  AnalyzeRequest,
  AnalyzeRequestSchema,
} from "@/validators/analyzeApiValidator";
import { TextRazorResponse } from "@/types/textRazorTypes";
import { API_KEY } from "@/constants/applicationConstants";

/**
 * POST handler for analyzing text with TextRazor API.
 *
 * This route accepts a JSON payload containing a `text` field,
 * validates it against `AnalyzeRequestSchema`, and sends it
 * to the TextRazor API for entity extraction.
 *
 * @param {NextRequest} req - The incoming HTTP request (must contain JSON with `text`).
 * @returns {Promise<NextResponse>} - A JSON response with the extracted entities or an error.
 *
 * @example
 * // Request body
 * {
 *   "text": "George Bush was president of USA."
 * }
 *
 * // Example response
 * {
 *   "response": {
 *     "entities": [
 *       { "entityId": "George Bush", "type": ["Person"], ... },
 *       { "entityId": "USA", "type": ["Country"], ... }
 *     ]
 *   }
 * }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await req.json();
    const parsed = AnalyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 },
      );
    }

    const { text } = parsed.data as AnalyzeRequest;

    // Check if API key is configured
    if (!API_KEY) {
      return NextResponse.json(
        { error: "TEXTRAZOR_API_KEY not set" },
        { status: 500 },
      );
    }

    // Call TextRazor API with the provided text
    const response = await axios.post<TextRazorResponse>(
      "https://api.textrazor.com/",
      new URLSearchParams({ text, extractors: "entities" }),
      {
        headers: {
          "x-textrazor-key": API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (err: unknown) {
    // Handle Axios errors (API request issues)
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { error: err.message },
        { status: err.response?.status ?? 500 },
      );
    }

    // Handle general errors
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
