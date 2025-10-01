/**
 * API key for accessing the TextRazor API.
 * The value is loaded from the environment variables.
 * Make sure to set `TEXTRAZOR_API_KEY` in your environment.
 * 
 * @type {string | undefined}
 */
export const API_KEY: string | undefined = process.env.TEXTRAZOR_API_KEY;

/**
 * Array of color hex codes used for charts, highlights, or visual elements.
 * Each color is a distinct, visually appealing option.
 * 
 * @type {string[]}
 */
export const COLORS: string[] = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
];