import { validTypes } from "../constants";

export class InvalidExpressionType extends Error {
  constructor(value: any) {
    const validTypesFormatted = validTypes.join(", ");

    super(
      `Invalid expression type. Expected one of ${validTypesFormatted}, got ${typeof value}.`
    );
  }
}
