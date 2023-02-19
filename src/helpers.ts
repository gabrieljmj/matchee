import type {
  MatchValue,
  CallableResult,
  Match,
  SingleMatch,
  Expression,
} from './match';
import { VALID_EXPRESSION_TYPES } from './constants';
import { InvalidExpressionType } from './exceptions/invalid-expression-type';

export const isObject = (x: unknown): x is object => typeof x === 'object';

export function isRegExp(x: unknown): x is RegExp {
  return x instanceof RegExp;
}

export function hasValidExpressionType(x: unknown) {
  return VALID_EXPRESSION_TYPES.includes(typeof x);
}

/**
 * If the value is a function, we need to call it to get the actual value
 */
export const getValue = async <MatchCondition, T>(
  value: MatchValue<MatchCondition, T>,
  condition: Expression<MatchCondition>,
) => {
  if (typeof value === 'function') {
    const result = (value as CallableResult<MatchCondition, T>)(condition);

    if (result instanceof Promise) {
      return await result;
    }

    return result;
  }

  return value;
};

export const validateExpressions = <T, U>(expressions: Match<T, U>) => {
  const validate = (v: unknown) => {
    if (!hasValidExpressionType(v)) {
      throw new InvalidExpressionType(v);
    }
  };
  const validateGroupOfExpressions = (
    exp: MatchValue<T, U> | SingleMatch<T, U>,
  ) => Array.isArray(exp) && (exp.slice(0, -1) as U[]).forEach(validate);

  expressions.forEach(validateGroupOfExpressions);
};
