# matchee

Type-safe expression matching. Similar to [PHP's match expression](https://wiki.php.net/rfc/match_expression_v2).

## Installation

```sh
npm install matchee
```

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

## Available expression types

It is possible to use any type of expression as a match case. The following types are supported:

- `boolean`
- `number`
- `string`
- `object`
- `symbol`
- `regexp`
