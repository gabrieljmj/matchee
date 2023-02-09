import { it, expect } from "vitest";
import { UnhandledMatchExpression } from "../src/exceptions/unhandled-match-expression";
import { isMatchingError } from "../src/match";

it("should return true when error is instance of UnhandledMatchExpression", () => {
  const error = new UnhandledMatchExpression(1);

  expect(isMatchingError(error)).toBe(true);
});

it("should return false when error is not instance of UnhandledMatchExpression", () => {
  const error = new Error();

  expect(isMatchingError(error)).toBe(false);
});
