# hit
a light expression tools for hlang

# how to use 

```
import Hit, { ParamParser, Calculation, ParamPattern } from '../src/index';


const parser = new ParamParser();
const calculation = new Calculation();
const hit = new Hit(parser, calculation);    


const result = hit.run('1 * (2 * ({{a.b}} + 1))', {a: {b:1}}, ParamPattern.MUSTACHE);

expect(result).toEqual(4);
```
