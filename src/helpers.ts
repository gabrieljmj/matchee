import '@total-typescript/ts-reset';
import type {
  MatchValue,
  CallableResult,
  Match,
  SingleMatch,
  Expression,
} from './match';
import { VALID_EXPRESSION_TYPES } from './constants';
import { InvalidExpressionType } from './exceptions/invalid-expression-type';
import { ObjectPaths } from './object-paths';

export function isObject(x: unknown): x is object {
  return typeof x === 'object';
}

export function isRegExp(x: unknown): x is RegExp {
  return x instanceof RegExp;
}

export function isObjectPaths(x: unknown): x is ObjectPaths {
  return x instanceof ObjectPaths;
}

export function isString(x: unknown): x is string {
  return typeof x === 'string';
}

export function hasValidExpressionType(x: unknown) {
  return VALID_EXPRESSION_TYPES.includes(typeof x);
}

export function hasSameType(x: unknown, y: unknown) {
  return typeof x === typeof y;
}

/**
 * If the value is a function, we need to call it to get the actual value
 */
export async function getValue<MatchCondition, T>(
  value: MatchValue<MatchCondition, T>,
  condition: Expression<MatchCondition>,
) {
  if (typeof value === 'function') {
    const result = (value as CallableResult<MatchCondition, T>)(condition);

    if (result instanceof Promise) {
      return await result;
    }

    return result;
  }

  return value;
}

export function validateExpressions<T, U>(expressions: Match<T, U>) {
  const validate = (v: unknown) => {
    if (!hasValidExpressionType(v)) {
      throw new InvalidExpressionType(v);
    }
  };
  const validateGroupOfExpressions = (
    exp: MatchValue<T, U> | SingleMatch<T, U>,
  ) => Array.isArray(exp) && (exp.slice(0, -1) as U[]).forEach(validate);

  expressions.forEach(validateGroupOfExpressions);
}
