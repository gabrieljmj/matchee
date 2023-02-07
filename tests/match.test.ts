import { it, expect } from "vitest";
import { match } from "../src/match";
import { InvalidExpressionType } from "../src/exceptions/invalid-expression-type";
import { UnhandledMatchExpression } from "../src/exceptions/unhandled-match-expression";

it("should match the first value that contains a valid expression", () => {
  const value = match([
    [1, 2, "100"],
    [1, 3, "200"],
  ])(1);

  expect(value).toEqual("100");
});

it("should accept more than one condition", () => {
  const value = match([
    [1, 2, 3, "100"],
    [4, 5, "200"],
  ])(3);

  expect(value).toEqual("100");
});

it("should match the default value when there is not valid match", () => {
  const value = match([[1, 2, "100"], [1, 3, "200"], "300"])(4);

  expect(value).toEqual("300");
});

it("should throw an error when there is no default value and not matching keys", () => {
  expect(() =>
    match([
      [1, "1"],
      [2, "2"],
    ])(3)
  ).toThrow(new UnhandledMatchExpression(3));
});

it("should accept objects as expressions", () => {
  const value = match([
    [{ a: 1 }, { a: 2 }, "100"],
    [{ a: 3 }, { a: 4 }, "200"],
    "300",
  ])({ a: 1 });

  expect(value).toEqual("100");
});

it("should accept boolean values as expressions", () => {
  const value = match([[true, "100"], [false, "200"], "300"])(true);

  expect(value).toEqual("100");
});

it("should accept symbols as expressions", () => {
  const aSymbol = Symbol("a");
  const value = match([[aSymbol, "100"], [Symbol("b"), "200"], "300"])(aSymbol);

  expect(value).toEqual("100");
});

it("should not accept undefined as expressions", () => {
  expect(() =>
    match([[undefined, "100"], [false, "200"], "300"])(true)
  ).toThrow(new InvalidExpressionType(undefined));
});

it("should not accept function as expressions", () => {
  expect(() => match([[() => {}, "100"], "300"])(() => {})).toThrow(
    new InvalidExpressionType(() => {})
  );
});
