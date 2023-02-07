import { deepCompareObjects, simplyCompare } from "./comparison-handlers";
import { getValue, isObject, validateExpressions } from "./helpers";
import { UnhandledMatchExpression } from "./exceptions/unhandled-match-expression";

export type CallableResult<MatchResult> = () => MatchResult;

export type MatchValue<MatchResult> = MatchResult | CallableResult<MatchResult>;

export type SingleMatch<MatchResult, MatchCondition> = [
  ...keys: MatchCondition[],
  value: MatchValue<MatchResult>
];

export type Match<MatchResult, MatchCondition> = [
  ...expressions: Array<SingleMatch<MatchResult, MatchCondition>>,
  defaultValue: MatchResult | SingleMatch<MatchResult, MatchCondition>
];

export function match<MatchResult, MatchCondition>(
  expressions: Match<MatchResult, MatchCondition>
) {
  validateExpressions(expressions);

  return (value: MatchCondition) => {
    const expIndex = expressions.findIndex((v) => {
      if (Array.isArray(v)) {
        const validExpressions = v.slice(0, -1) as MatchCondition[];

        if (isObject(value)) {
          return validExpressions.some((exp) =>
            deepCompareObjects(exp as object, value)
          );
        }

        return validExpressions.some((exp) => simplyCompare(exp, value));
      }

      return false;
    });

    const lastValue = expressions[expressions.length - 1];
    const hasDefaultValue = !Array.isArray(lastValue);

    if (expIndex === -1) {
      if (hasDefaultValue) {
        return getValue(lastValue);
      }

      throw new UnhandledMatchExpression(value);
    }

    const found = expressions[expIndex] as SingleMatch<
      MatchResult,
      MatchCondition
    >;
    const foundValue = found[found.length - 1] as MatchValue<MatchResult>;

    return getValue(foundValue);
  };
}
