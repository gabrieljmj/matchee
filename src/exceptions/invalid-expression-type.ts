import { VALID_EXPRESSION_TYPES } from "../constants";

export class InvalidExpressionType extends Error {
  constructor(value: any) {
    const validTypesFormatted = VALID_EXPRESSION_TYPES.join(", ");

    super(
      `Invalid expression type. Expected one of ${validTypesFormatted}, got ${typeof value}.`
    );
  }
}
