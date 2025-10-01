import { z } from "zod";

/**
 * Zod schema for validating the request body of the analyze API.
 *
 * Ensures that the `text` field:
 * - is a string
 * - is not empty
 *
 * @example
 * const valid = AnalyzeRequestSchema.parse({ text: "Some text to analyze" });
 * // valid passes validation
 */
export const AnalyzeRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

/**
 * TypeScript type inferred from AnalyzeRequestSchema.
 *
 * Represents the structure of the request body expected by the analyze API.
 *
 * @typedef {Object} AnalyzeRequest
 * @property {string} text - The text to analyze (required, non-empty)
 *
 * @example
 * const request: AnalyzeRequest = { text: "George Bush was president of USA." };
 */
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
