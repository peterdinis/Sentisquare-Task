"use client"

import { TextRazorResponse } from '@/types/textRazorTypes';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';


export const useAnalyzeText = () => {
    return useMutation({
        mutationKey: ["newAnalyze"],
        mutationFn: async (text: string): Promise<TextRazorResponse> => {
            const res = await axios.post('/api/analyze', { text });
            return res.data as TextRazorResponse;
        },
        retry: 1,
        onError: (err) => console.error('analyze mutation error', err)
    });
};