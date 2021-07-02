# hit
a light expression tools for hlang

# install

```shell
npm i @hset/hit
```

# how to use 

``` typescript
import Hit, { ParamParser, Calculation, ParamPattern } from '@hset/hit';


const parser = new ParamParser();
const calculation = new Calculation();
const hit = new Hit(parser, calculation);    


const result = hit.run('1 * (2 * ({{a.b}} + 1))', {a: {b:1}}, ParamPattern.MUSTACHE);

expect(result).toEqual(4);
```

# about param pattern

ParamParser support two param pattern by default

- Jinjia2/Mustache style {{param}}
- Dollar Pattern $param

And you can extend more patterns by using paramParser.add api, just like:

```typescript
import * as _get from 'lodash.get';

const parser = new ParamParser();

parser.add(ParamPattern.MUSTACHE, function (template: string, context: Object) {
  const isParam = namespace => /^{{(.+)}}$/.test(namespace);
  const trimed = template.trim();
  if (isParam(trimed)) {
    return _get(context, trimed.replace(/{|}/g, '').trim());
  }

  return template;
}); 
```

# about calculation

Calculation support serveral calculations by default, including:

- PLUS +
- MINUS - 
- MULTIPLY *
- DIVIDE /
- AND &&
- OR ||
- XOR ^
- BOR |
- GT >
- GTE >=
- LT < 
- LTE <=
- EQUALS ==
- SAME ===
- NOT_EQUALS !=
- NOT_SAME !==


And also you can extend more calculations by using calculation.add api, just like:

```typescript
import { Calculation } from '@hset/hit';

const calculation = new Calculation();

calculation.add('+', 14, function(left, right) {
  if (isNaN(+left) || isNaN(+right)) {
    return left + right;
  }

  return (+left) + (+right);
}); 
```

# about calculation priority

calculation with priority in the expression are supported, you can use () in the expression. Nested blocks are also supported.


