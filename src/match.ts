import { deepCompareObjects, simplyCompare } from "./comparison-handlers";
import { getValue, isObject, isRegExp, validateExpressions } from "./helpers";
import { UnhandledMatchExpression } from "./exceptions/unhandled-match-expression";

export type Expression<MatchCondition> = MatchCondition extends RegExp
  ? string | number
  : MatchCondition;

export type CallableResult<MatchResult, MatchCondition> = (
  condition: Expression<MatchCondition>
) => MatchResult;

export type MatchValue<MatchResult, MatchCondition> =
  | MatchResult
  | CallableResult<MatchResult, MatchCondition>;

export type SingleMatch<MatchResult, MatchCondition> = [
  ...keys: MatchCondition[],
  value: MatchValue<MatchResult, MatchCondition>
];

export type Match<MatchResult, MatchCondition> = [
  ...expressions: Array<SingleMatch<MatchResult, MatchCondition>>,
  defaultValue:
    | MatchValue<MatchResult, MatchCondition>
    | SingleMatch<MatchResult, MatchCondition>
];

export type InferMatchCondition<MatchValue extends (value: any) => any> =
  ReturnType<MatchValue>;

export function isMatchingError(error: any): error is UnhandledMatchExpression {
  return error instanceof UnhandledMatchExpression;
}

export function match<MatchResult, MatchCondition>(
  expressions: Match<MatchResult, MatchCondition>
) {
  validateExpressions(expressions);

  return (value: Expression<MatchCondition>) => {
    const expIndex = expressions.findIndex((v) => {
      if (Array.isArray(v)) {
        const validExpressions = v.slice(0, -1) as MatchCondition[];

        if (isObject(value)) {
          return validExpressions.some((exp) =>
            deepCompareObjects(exp as object, value)
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
        return getValue(lastValue, value);
      }

      throw new UnhandledMatchExpression(value);
    }

    const found = expressions[expIndex] as SingleMatch<
      MatchResult,
      MatchCondition
    >;
    const foundValue = found[found.length - 1] as MatchValue<
      MatchResult,
      MatchCondition
    >;

    return getValue(foundValue, value);
  };
}
