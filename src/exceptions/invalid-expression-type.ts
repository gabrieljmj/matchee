import { VALID_EXPRESSION_TYPES } from '../constants';

export class InvalidExpressionType extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(value: any) {
    const validTypesFormatted = VALID_EXPRESSION_TYPES.join(', ');

    super(
      `Invalid expression type. Expected one of ${validTypesFormatted}, got ${typeof value}.`,
    );
  }
}
