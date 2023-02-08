import type { MatchValue, CallableResult, Match, SingleMatch } from "./match";
import { validTypes } from "./constants";
import { InvalidExpressionType } from "./exceptions/invalid-expression-type";

export const isObject = (x: any): x is object => typeof x === "object";

export function isRegExp(x: any): x is RegExp {
  return x instanceof RegExp;
}

/**
 * If the value is a function, we need to call it to get the actual value
 */
export const getValue = <T>(value: MatchValue<T>) => {
  if (typeof value === "function") {
    return (value as CallableResult<T>)();
  }

  return value;
};

export const validateExpressions = <T, U>(expressions: Match<T, U>) => {
  const validate = (v: any) => {
    if (!validTypes.includes(typeof v)) {
      throw new InvalidExpressionType(v);
    }
  };
  const validateGroupOfExpressions = (exp: T | SingleMatch<T, U>) =>
    Array.isArray(exp) && exp.slice(0, -1).forEach(validate);

  expressions.forEach(validateGroupOfExpressions);
};
