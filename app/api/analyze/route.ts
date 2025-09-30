import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import { z } from "zod";
import {
  AnalyzeRequest,
  AnalyzeRequestSchema,
} from "@/validators/analyzeApiValidator";
import { TextRazorResponse } from "@/types/textRazorTypes";

const API_KEY = process.env.TEXTRAZOR_API_KEY;

/**
 * POST /api/analyze
 * Body: { text: string }
 * Returns response from TextRazor (entities)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = AnalyzeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 },
      );
    }

    const { text } = parsed.data as AnalyzeRequest;

    if (!API_KEY) {
      return NextResponse.json(
        { error: "TEXTRAZOR_API_KEY not set" },
        { status: 500 },
      );
    }

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
    if (axios.isAxiosError(err)) {
      console.error("API analyze error", err.response?.data ?? err.message);
      return NextResponse.json(
        { error: err.message },
        { status: err.response?.status ?? 500 },
      );
    }

    if (err instanceof Error) {
      console.error("API analyze error", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    console.error("API analyze error", err);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
