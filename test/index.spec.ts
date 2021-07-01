import Hit, { ParamParser, Calculation, ParamPattern } from '../src/index';

const parser = new ParamParser();
const calculation = new Calculation();
const hit = new Hit(parser, calculation);

test("test normal param", () => {
    const result = hit.run('abc', {}, ParamPattern.Dollar);

    expect(result).toEqual('abc');
});

test("test mustache template param", () => {
    const result = hit.run('{{abc}}', {abc: 1}, ParamPattern.MUSTACHE);

    expect(result).toEqual(1);
});

test("test mustache dollar param", () => {
    const result = hit.run('$a.b', {a: {b:2}}, ParamPattern.Dollar);

    expect(result).toEqual(2);
});

test("test expression with normal param", () => {
    const result = hit.run('1 + 2 + 3', {}, ParamPattern.Dollar);

    expect(result).toEqual(6);
});

test("test expression with priority param", () => {
    const result = hit.run('1 + 2 * 3', {}, ParamPattern.Dollar);

    expect(result).toEqual(7);
});

test("test expression with block priority param", () => {
    const result = hit.run('1 * (2 + 3)', {}, ParamPattern.Dollar);

    expect(result).toEqual(5);
});

test("test expression with complex block priority", () => {
    const result = hit.run('1 * (2 * (3 + 1))', {}, ParamPattern.Dollar);

    expect(result).toEqual(8);
});

test("test expression with mustache template param", () => {
    const result = hit.run('1 * (2 * ({{num}} + 1))', {num: 2}, ParamPattern.MUSTACHE);

    expect(result).toEqual(6);
});


test("test expression with mustache template param 2", () => {
    const result = hit.run('1 * (2 * ({{a.b}} + 1))', {a: {b:1}}, ParamPattern.MUSTACHE);

    expect(result).toEqual(4);
});


test("test boolean expression ", () => {
    const result = hit.run('{{a}} > {{b}}', {a: 1, b: 2}, ParamPattern.MUSTACHE);

    expect(result).toEqual(false);
});

test("test boolean expression 2", () => {
    const result = hit.run('{{a}} === {{b}}', {a: 1, b: 1}, ParamPattern.MUSTACHE);

    expect(result).toEqual(true);
});

test("test boolean expression 3", () => {
    const result = hit.run('{{a}} === {{b}}', {a: 'a', b: 'a'}, ParamPattern.MUSTACHE);

    expect(result).toEqual(true);
});

test("test logic expression", () => {
    const result = hit.run('{{a}} ^ {{b}}', {a: 'a', b: 'a'}, ParamPattern.MUSTACHE);

    expect(result).toEqual(0);
});

test("test logic expression 2", () => {
    const result = hit.run('{{a}} && {{b}}', {a: true, b: false}, ParamPattern.MUSTACHE);

    expect(result).toEqual(false);
});