import { z } from "zod";

export const AnalyzeRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
