/**
 * Represents a single entity recognized by TextRazor's Named Entity Recognition (NER).
 *
 * @interface TextRazorEntity
 */
export interface TextRazorEntity {
  /** Unique identifier of the entity */
  entityId: string;
  /** Array of types for the entity (e.g., Person, Organization, Location) */
  type: string[];
  /** Confidence score (0–1) indicating how certain TextRazor is about this entity */
  confidenceScore: number;
  /** The exact substring from the text that matched this entity */
  matchedText: string;
  /** Optional array of DBpedia types for the entity, if available */
  dbpediaTypes?: string[];
}

/**
 * Simplified response structure from the TextRazor API.
 *
 * @interface TextRazorResponse
 */
export interface TextRazorResponse {
  /** The main response object containing extracted entities */
  response: {
    /** Array of entities detected in the analyzed text */
    entities: TextRazorEntity[];
  };
}

/**
 * Local structure representing a single line of text and its associated entities.
 *
 * Used in the frontend for storing processed lines from a text file.
 *
 * @interface LineData
 */
export interface LineData {
  /** Original text of the line */
  text: string;
  /** Array of entities detected in this line */
  entities: TextRazorEntity[];
}
