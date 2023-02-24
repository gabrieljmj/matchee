import {
  compareObjectsWithPaths,
  deepCompareObjects,
  simplyCompare,
} from './comparison-handlers';
import {
  getValue,
  isObject,
  isObjectPaths,
  isRegExp,
  validateExpressions,
} from './helpers';
import { UnhandledMatchExpression } from './exceptions/unhandled-match-expression';
import { ObjectPaths } from './object-paths';

export type Expression<MatchCondition> = MatchCondition extends RegExp
  ? string | number
  : MatchCondition extends ObjectPaths
  ? object
  : MatchCondition;

export type CallableResult<MatchCondition, MatchResult> = (
  condition: Expression<MatchCondition>,
) => MatchResult;

export type MatchValue<MatchCondition, MatchResult> =
  | MatchResult
  | CallableResult<MatchCondition, MatchResult | Promise<MatchResult>>;

export type SingleMatch<MatchCondition, MatchResult> = [
  ...keys: MatchCondition[],
  value: MatchValue<MatchCondition, MatchResult>,
];

export type Match<MatchCondition, MatchResult> = [
  ...expressions: Array<SingleMatch<MatchCondition, MatchResult>>,
  defaultValue:
    | MatchValue<MatchCondition, MatchResult>
    | SingleMatch<MatchCondition, MatchResult>,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferMatchCondition<MatchValue extends (value: any) => any> =
  Awaited<ReturnType<MatchValue>>;

export function isMatchingError(
  error: unknown,
): error is UnhandledMatchExpression {
  return error instanceof UnhandledMatchExpression;
}

export function match<MatchCondition, MatchResult>(
  expressions: Match<MatchCondition, MatchResult>,
) {
  validateExpressions(expressions);

  return async (value: Expression<MatchCondition>) => {
    const expIndex = expressions.findIndex((v) => {
      if (Array.isArray(v)) {
        const validExpressions = v.slice(0, -1) as MatchCondition[];

        if (isObject(value)) {
          return validExpressions.some((exp) =>
            isObjectPaths(exp)
              ? compareObjectsWithPaths(value, exp)
              : deepCompareObjects(exp as object, value),
          );
        }

        return validExpressions.some((exp) => {
          if (isRegExp(exp)) {
            return exp.test(value as string);
          }

          return simplyCompare(exp, value as MatchCondition);
        });
      }

      return false;
    });

    const lastValue = expressions[expressions.length - 1];
    const hasDefaultValue = !Array.isArray(lastValue);

    if (expIndex === -1) {
      if (hasDefaultValue) {
        return await getValue(lastValue, value);
      }

      throw new UnhandledMatchExpression(value);
    }

    const found = expressions[expIndex] as SingleMatch<
      MatchCondition,
      MatchResult
    >;
    const foundValue = found[found.length - 1] as MatchValue<
      MatchCondition,
      MatchResult
    >;

    return await getValue(foundValue, value);
  };
}
