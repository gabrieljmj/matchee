#### 0.4.0 (2023-03-30)

##### Chores

- update dependencies ([f7b2421b](https://github.com/gabrieljmj/matchee/commit/f7b2421bc8d93358a4ba0a80d242b7d7a9921d0c))

##### Documentation Changes

- add contributing section ([2ce9b2bf](https://github.com/gabrieljmj/matchee/commit/2ce9b2bf648d4b3347900bb9222265a5fdfc91f2))
- fix invalid code on docs ([83b30921](https://github.com/gabrieljmj/matchee/commit/83b3092184080f2d252ee97aac17aea27342915d))
- add ObjectPath to docs ([af173e17](https://github.com/gabrieljmj/matchee/commit/af173e17e3055ce4cdc014c32e560f00d136b491))

##### New Features

- add `asyncMatch` function ([6bc44304](https://github.com/gabrieljmj/matchee/commit/6bc443044ed47f37b89524906914b0305361c00d))

##### Refactors

- decrease `as` operators ([c8a3acbb](https://github.com/gabrieljmj/matchee/commit/c8a3acbba6e2935ea9e5205a08e3bff989c1772f))
- add separate logic to find matching expression from main match function ([18a0a208](https://github.com/gabrieljmj/matchee/commit/18a0a208778f342bf66958d11f988078d435bdeb))
- use only functions on helpers file ([8dd7e848](https://github.com/gabrieljmj/matchee/commit/8dd7e848c029453edfd83e3a8cf17b299c12c799))
- use const instead of function ([2c3c1a36](https://github.com/gabrieljmj/matchee/commit/2c3c1a3668c5a314a976f34bdb8cad3a472439c1))

#### 0.3.0 (2023-02-24)

##### Documentation Changes

- improve readme ([d2986918](https://github.com/gabrieljmj/matchee/commit/d298691867cc58238108d7835e8b3ba0f4e2ed03))

##### New Features

- add 'objectPath' function ([c60c3b2b](https://github.com/gabrieljmj/matchee/commit/c60c3b2b4cec26eef0096c3453d27b1af08b8e26))

##### Refactors

- use ts-reset and make const readonly ([cd87a874](https://github.com/gabrieljmj/matchee/commit/cd87a874ca7d0ba8574a28da3c5d14536730272a))
- flip generics ([0ed99f3b](https://github.com/gabrieljmj/matchee/commit/0ed99f3bbbd27bf88cc1c8f640c07397d0c7e469))

#### 0.2.2 (2023-02-18)

##### Chores

- fix lint command ([fd95db0c](https://github.com/gabrieljmj/matchee/commit/fd95db0c76627436dcaabcca2dacbfe03e365bc6))
- add keywords on package.json ([dc98e68e](https://github.com/gabrieljmj/matchee/commit/dc98e68e47430e33178fa730cdf11e70ea9dab98))

##### Documentation Changes

- improve readme ([ce9091e4](https://github.com/gabrieljmj/matchee/commit/ce9091e41523f4b9cc7201a88562bd7556444771))

##### Bug Fixes

- add eslint ignore line comment ([8078c37a](https://github.com/gabrieljmj/matchee/commit/8078c37a75ebbf94df05b28ae37d889ff2277edb))
- fix ts issues ([71f0f4e0](https://github.com/gabrieljmj/matchee/commit/71f0f4e0fb41b2d274d721a4f73823adbe30ee0a))

##### Refactors

- use unknown instead of any ([4a34f838](https://github.com/gabrieljmj/matchee/commit/4a34f83866ac65014193b26a33f63fa3edd41d21))

##### Code Style Changes

- install eslint and prettier ([5263afe0](https://github.com/gabrieljmj/matchee/commit/5263afe048cac20c6bc5ca7e4ba3c2b345780b96))

#### 0.2.1 (2023-02-16)

##### Bug Fixes

- add Awaited to InferMatchCondition ([70d0c183](https://github.com/gabrieljmj/matchee/commit/70d0c183d58a64f774db7005fe9d6dd266aea62c))

#### 0.2.0 (2023-02-16)

##### Chores

- add changeset to .npmignore ([e0bf1eb9](https://github.com/gabrieljmj/matchee/commit/e0bf1eb9f82d3a4f085522b49eb263529e7e1320))
- add changeset ([e870e296](https://github.com/gabrieljmj/matchee/commit/e870e296cdad95744ddff795d5498edb88f6117f))

##### Documentation Changes

- add docs for callable values ([c15fca81](https://github.com/gabrieljmj/matchee/commit/c15fca81405d8fc66a963a95069a00e743a4a443))
- remove wrong code line ([e3d82f52](https://github.com/gabrieljmj/matchee/commit/e3d82f522fd552e9144ee5450138199d05affa65))
- add docs for isMatchingError ([50840426](https://github.com/gabrieljmj/matchee/commit/50840426951eb8fb28f29b1f5211ad32995209f0))

##### New Features

- accept promises as values and always returns promise on match function ([bdf97de8](https://github.com/gabrieljmj/matchee/commit/bdf97de85dc1e17885d21256f38d1511eb3d1573))
- add condition param on function values ([d0769297](https://github.com/gabrieljmj/matchee/commit/d0769297d9556fdc317fca8a6f844f9acd97fab9))
- add isMatchingError ([c8d6cd5b](https://github.com/gabrieljmj/matchee/commit/c8d6cd5bfd3428073cd2cbb015f0b918ffdfc494))

##### Refactors

- create helper to validate types ([53a97158](https://github.com/gabrieljmj/matchee/commit/53a97158ae0d6f518e056872d91ee7e835f916b6))
- use snake case on constant ([4ddd5411](https://github.com/gabrieljmj/matchee/commit/4ddd541108430b637cb2258b76af2bf56ff7317f))

##### Tests

- add test when value is a promise ([08b27afa](https://github.com/gabrieljmj/matchee/commit/08b27afa80d56440e4aba5387ce86d4ee88ec9aa))
