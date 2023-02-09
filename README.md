# matchee

Type-safe expression matching. Similar to [PHP's match expression](https://wiki.php.net/rfc/match_expression_v2).

## Installation

```sh
npm install matchee
```

## Motivation

The `match` function is a type-safe way to match expressions. It is similar to the `switch` statement, but with a more concise syntax and more flexibility. It allows to match more than one expression at a time and more types of expressions.

Currently on JavaScript, the `switch` or object literals statement are the most common way to match expressions. However, it is not type-safe and it is not possible to match more than one expression at a time.

Also, it is possible to pass functions as values. This allows to make heavy computations or database queries or any other side effect only when needed.

## Usage

The basic usage is to pass an array of cases to the `match` function. Each case is an array of values, where the last value is the result of the match.

It is possible to pass a default case, which is a single value. If no case matches, the default case is returned.

```ts
import { match } from "matchee";

const matcher = match([
  [1, 2, "100"],
  [3, "200"],
  "300", // default
]);

matcher(1); // 100
matcher(2); // 100
matcher(3); // 200
matcher(5); // 300
```

### Usage tricks

#### Using boolean values

Using the same example used on PHP docs, we can use the `match` to check for boolean values. The first match case will be used.

```ts
import { match } from "matchee";

const age = 23;

const matcher = match([
  [age >= 65, "senior"],
  [age >= 18, "adult"],
  [age >= 13, "teenager"],
  "kid",
]);

const result = matcher(true); // "adult"

const regex = /foo|bar|baz/;
```

#### Using regular expressions

```ts
import { match } from "matchee";

const regex = /foo|bar|baz/;
const matcher = match([[regex, "match"], "no match"]);

matcher("foo"); // "match"
matcher("bar"); // "match"
matcher("baz"); // "match"
matcher("qux"); // "no match"
```

or a more complex example using brazilian document numbers:

```ts
import { match } from "matchee";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

const matcher = match([
  [cpfRegex, "CPF"],
  [cnpjRegex, "CNPJ"],
  () => {
    throw new Error("Invalid document");
  },
]);

matcher("123.456.789-10"); // "CPF"
matcher("12.345.678/9012-34"); // "CNPJ"
matcher("invalid"); // Error: Invalid document
```

### No matches found

If no match is found and no default case is provided, an error is thrown.

```ts
import { match } from "matchee";

try {
  const matcher = match([
    [1, 2, "100"],
    [3, "200"],
  ]);

  matcher(4);
} catch (error) {
  console.log(error.message); // UnhandledMatchExpression: No matching expression found for value 4. Maybe try adding a default value.
}
```

#### Checking if an error is from `matchee`

There is a helper function to check if an error is an `UnhandledMatchExpression` error: `isMatchError`.

```ts
import { match, isMatchingError } from "matchee";

try {
  // something that might throw an error...

  const matcher = match([
    [1, 2, "100"],
    [3, "200"],
  ]);

  matcher(4);
} catch (error) {
  if (isMatchingError(error)) {
    // handle match error

    return;
  }

  // handle other errors
}
```

### Inferring result type

It is provided a type-safe way to infer the result type of the match expression. The `InferMatchCondition` type is used to infer the result type.

```ts
import { match, type InferMatchCondition } from "matchee";

const matcher = match([[1, 2, "100"], [3, "200"], "300"]);

type ResultType = InferMatchCondition<typeof matcher>; // string
```

## Available expression types

It is possible to use any type of expression as a match case. The following types are supported:

- `boolean`
- `number`
- `string`
- `object`
- `symbol`
- `regexp`
