/**
 * Represents an entity recognized by TextRazor
 */
export interface TextRazorEntity {
  entityId: string;
  type: string[];
  confidenceScore: number;
  matchedText: string;
  dbpediaTypes?: string[];
}

/**
 * TextRazor API response (simplified)
 */
export interface TextRazorResponse {
  response: {
    entities: TextRazorEntity[];
  };
}

/**
 * Local structure for a single line of text and its entities
 */
export interface LineData {
  text: string;
  entities: TextRazorEntity[];
}
