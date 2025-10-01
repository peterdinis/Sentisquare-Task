import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAnalyzeText } from "../../hooks/useAnalyzeText";
import { TextRazorResponse } from "@/types/textRazorTypes";

vi.mock("axios");
const mockedAxios = axios as unknown as vi.Mocked<typeof axios>;

describe("useAnalyzeText", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should call API and return data", async () => {
    const mockData: TextRazorResponse = {
      response: {
        entities: [
          {
            entityId: "1",
            matchedText: "George Bush",
            type: ["Person"],
            confidenceScore: 0.99,
          },
        ],
      },
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useAnalyzeText(), { wrapper });

    act(() => {
      result.current.mutate("George Bush was president of USA.");
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockData);
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/analyze", {
      text: "George Bush was president of USA.",
    });
  });

  it("should handle API error", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useAnalyzeText(), { wrapper });

    act(() => {
      result.current.mutate("Some text");
    });

    await waitFor(() => result.current.isError);
  });
});
