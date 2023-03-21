<p align="center">
  <h1 align="center">matchee</h1>
</p>

<p align="center">
  <a href="https://npmjs.com/package/matchee">
    <img src="https://img.shields.io/npm/v/matchee" alt="npm version" />
  </a>
  <a href="https://github.com/gabrieljmj/matchee/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/gabrieljmj/matchee/main.yml" alt="build padding">
  </a>
</p>

<p align="center">
  Type-safe expression matching. Similar to <a href="https://wiki.php.net/rfc/match_expression_v2">PHP's match expression</a>.
</p>

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
import { match } from 'matchee';

const matcher = match([
  [1, 2, '100'],
  [3, '200'],
  '300', // default
]);

await matcher(1); // 100
await matcher(2); // 100
await matcher(3); // 200
await matcher(5); // 300
```

### Using functions as values

When the values are functions, they are called only when the case matches. It also allows to return a promise.

```ts
import { match } from 'matchee';

const matcher = match([
  [1, () => '100'],
  [2, async () => Promise.resolve('200')],
  [3, '300'],
  '400', // default
]);

await matcher(1); // 100
await matcher(2); // 200
await matcher(3); // 300
await matcher(5); // 400
```

### Using objects paths

A special syntax is available to match objects paths. It is possible to use the helper `objectPath` create expressions to match object values.

```ts
import { match, objectPath } from 'matchee';

const matcher = match([
  [
    objectPath({
      'user.role': 'admin',
    }),
    'ADMIN_ROLE',
  ],
  [
    objectPath({
      'user.role': 'user',
    }),
    'USER_ROLE',
  ],
  'GUEST_ROLE', // default
]);

await matcher({
  user: {
    role: 'admin',
  },
}); // ADMIN_ROLE
await matcher({
  user: {
    role: 'user',
  },
}); // USER_ROLE
await matcher({
  user: {
    role: 'guest',
  },
}); // GUEST_ROLE
```

### Usage tricks

#### Using boolean values

Using the same example used on PHP docs, we can use the `match` to check for boolean values. The first match case will be used.

```ts
import { match } from 'matchee';

const age = 23;

const matcher = match([
  [age >= 65, 'senior'],
  [age >= 18, 'adult'],
  [age >= 13, 'teenager'],
  'kid',
]);

const result = await matcher(true); // "adult"
```

#### Using regular expressions

```ts
import { match } from 'matchee';

const regex = /foo|bar|baz/;
const matcher = match([[regex, 'match'], 'no match']);

await matcher('foo'); // "match"
await matcher('bar'); // "match"
await matcher('baz'); // "match"
await matcher('qux'); // "no match"
```

or a more complex example using brazilian document numbers:

```ts
import { match } from 'matchee';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

const matcher = match([
  [cpfRegex, 'CPF'],
  [cnpjRegex, 'CNPJ'],
  () => {
    throw new Error('Invalid document');
  },
]);

await matcher('123.456.789-10'); // "CPF"
await matcher('12.345.678/9012-34'); // "CNPJ"
await matcher('invalid'); // Error: Invalid document
```

### No matches found

If no match is found and no default case is provided, an error is thrown.

```ts
import { match } from 'matchee';

try {
  const matcher = match([
    [1, 2, '100'],
    [3, '200'],
  ]);

  await matcher(4);
} catch (error) {
  console.log(error.message); // UnhandledMatchExpression: No matching expression found for value 4. Maybe try adding a default value.
}
```

#### Checking if an error is from `matchee`

There is a helper function to check if an error is an `UnhandledMatchExpression` error: `isMatchError`.

```ts
import { match, isMatchingError } from 'matchee';

try {
  // something that might throw an error...

  const matcher = match([
    [1, 2, '100'],
    [3, '200'],
  ]);

  await matcher(4);
} catch (error) {
  if (isMatchingError(error)) {
    // handle match error

    return;
  }

  // handle other errors
}
```

### Specifying type of conditions and values

The `match` function accepts generics to specify both condition and value types. The first one is the type of the conditions and the second one is the type of the values.

```ts
import { match } from 'matchee';

match<number, string>([
  [1, 2, '100'],
  ['3', '200'], // ts-error: Type 'string' is not assignable to type 'number'.
  '300', // default
]);

match<number | string, string>([
  [1, 2, '100'],
  ['3', '200'],
  '300', // default
]); // works!
```

### Inferring result type

It is provided a type-safe way to infer the result type of the match expression. The `InferMatchCondition` type is used to infer the result type.

```ts
import { match, type InferMatchCondition } from 'matchee';

const matcher = match([[1, 2, '100'], [3, '200'], '300']);

type ResultType = InferMatchCondition<typeof matcher>; // string
```

## Available expression types

It is possible to use any type of expression as a match case. The following types are supported:

- `boolean`
- `number`
- `string`
- `object`
- `Symbol`
- `RegExp`
- `ObjectPaths` - a special type to match object paths

## Contributing

All ideias and suggestions are welcome. Just create an issue or a pull request. Current not implemented features can be found [here](https://github.com/gabrieljmj/matchee/issues?q=is%3Aopen+is%3Aissue+label%3Afeature).
