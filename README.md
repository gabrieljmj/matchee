# matchee

Type-safe expression matching. Similar to [PHP's match expression](https://wiki.php.net/rfc/match_expression_v2).

## TODO

Add docs and improve examples.

## Usage

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
