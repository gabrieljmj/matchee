import { it, expect } from "vitest";
import { match } from "../src/match";
import { InvalidExpressionType } from "../src/exceptions/invalid-expression-type";
import { UnhandledMatchExpression } from "../src/exceptions/unhandled-match-expression";

it("should match the first value that contains a valid expression", async () => {
  const value = match([
    [1, 2, "100"],
    [1, 3, "200"],
  ])(1);

  await expect(value).resolves.toEqual("100");
});

it("should accept more than one condition", async () => {
  const value = match([
    [1, 2, 3, "100"],
    [4, 5, "200"],
  ])(3);

  await expect(value).resolves.toEqual("100");
});

it("should match the default value when there is not valid match", async () => {
  const value = match([[1, 2, "100"], [1, 3, "200"], "300"])(4);

  await expect(value).resolves.toEqual("300");
});

it("should throw an error when there is no default value and not matching keys", async () => {
  await expect(
    match([
      [1, "1"],
      [2, "2"],
    ])(3)
  ).rejects.toThrow(new UnhandledMatchExpression(3));
});

it("should accept objects as expressions", async () => {
  const value = match([
    [{ a: 1 }, { a: 2 }, "100"],
    [{ a: 3 }, { a: 4 }, "200"],
    "300",
  ])({ a: 1 });

  await expect(value).resolves.toEqual("100");
});

it("should accept boolean values as expressions", async () => {
  const value = match([[true, "100"], [false, "200"], "300"])(true);

  await expect(value).resolves.toEqual("100");
});

it("should accept symbols as expressions", async () => {
  const aSymbol = Symbol("a");
  const value = match([[aSymbol, "100"], [Symbol("b"), "200"], "300"])(aSymbol);

  await expect(value).resolves.toEqual("100");
});

it("should not accept undefined as expressions", async () => {
  expect(() => match([[undefined, "100"], [false, "200"], "300"])).toThrow(
    new InvalidExpressionType(undefined)
  );
});

it("should not accept function as expressions", async () => {
  expect(() => match([[() => {}, "100"], "300"])).toThrow(
    new InvalidExpressionType(() => {})
  );
});

it("should execute a function only when the expression is matched", async () => {
  const matcher = match([
    [1, 2, "100"],
    [3, 4, "200"],
    [
      5,
      () => {
        throw new Error("Should be executed");
      },
    ],
  ]);

  await expect(matcher(1)).resolves.toEqual("100");
  await expect(matcher(5)).rejects.toThrow(new Error("Should be executed"));
});

it("should compare regex expressions with strings and numbers", async () => {
  const matcher = match([[/^1/, 1, { a: 1 }, "100"], [/^b/, "200"], "300"]);

  await expect(matcher(1)).resolves.toEqual("100");
  await expect(matcher({ a: 1 })).resolves.toEqual("100");
  await expect(matcher("b")).resolves.toEqual("200");
  await expect(matcher("c")).resolves.toEqual("300");
});

it("should allow function as default value", async () => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

  const matcher = match([
    [cpfRegex, "CPF"],
    [cnpjRegex, "CNPJ"],
    () => {
      throw new Error("Invalid document");
    },
  ]);

  await expect(matcher("123.456.789-10")).resolves.toEqual("CPF");
  await expect(matcher("12.345.678/9012-34")).resolves.toEqual("CNPJ");
  await expect(matcher("123")).rejects.toThrow(new Error("Invalid document"));
});

it("should allow function that accepts as parameter the passed condition", async () => {
  const matcher = match([
    [1, 2, "100"],
    [3, 4, "200"],
    [
      5,
      (condition) => {
        expect(condition).toEqual(5);

        return (condition * 100).toString();
      },
    ],
  ]);

  await expect(matcher(5)).resolves.toEqual("500");
});
