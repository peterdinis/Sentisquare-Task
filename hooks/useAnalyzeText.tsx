"use client";

import { TextRazorResponse } from "@/types/textRazorTypes";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

/**
 * Custom hook to analyze a text string using the TextRazor API.
 *
 * Wraps a **React Query useMutation** for sending text to the backend API
 * and receiving extracted entities.
 *
 * Features:
 * - Sends POST request to `/api/analyze` with the text
 * - Returns a mutation object with status flags (isPending, isError, etc.)
 * - Retries once on failure
 * - Logs errors to the console
 *
 * @returns {ReturnType<typeof useMutation<TextRazorResponse, unknown, string>>}
 * The mutation object with functions like mutate, mutateAsync and state flags
 *
 * @example
 * const { mutateAsync, isPending, isError } = useAnalyzeText();
 * await mutateAsync("George Bush was president of USA.");
 */
export const useAnalyzeText = (): ReturnType<
  typeof useMutation<TextRazorResponse, unknown, string>
> => {
  return useMutation({
    mutationKey: ["newAnalyze"],
    mutationFn: async (text: string): Promise<TextRazorResponse> => {
      const res = await axios.post("/api/analyze", { text });
      return res.data as TextRazorResponse;
    },
    retry: 1,
    onError: (err) => console.error("analyze mutation error", err),
  });
};
