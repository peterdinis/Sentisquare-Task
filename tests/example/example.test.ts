import { describe, it, expect } from "vitest";
import { add, multiply } from "../utils/mathUtils";

describe("mathUtils", () => {
  /**
   * Test the `add` function to ensure it correctly adds two numbers.
   */
  it("adds two numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  /**
   * Test the `multiply` function to ensure it correctly multiplies two numbers.
   */
  it("multiplies two numbers correctly", () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(-2, 3)).toBe(-6);
  });
});
