import ParamParser from './param_parser';
import Expression from './expression';
import Calculation from './calculation';

export * from './calculation';
export * from './param_parser';
export { Calculation, ParamParser };
export default class Hit {
    expression: string;
    calculation: Calculation;
    operators: {[key: string]: number};
    parserManager: ParamParser; 
    constructor(parser: ParamParser, calculation) {
        this.calculation = calculation;
        this.parserManager = parser;

        return this;
    }

    run(template: string, context: object, parseType: string) {
        const parser = this.parserManager.getParser(parseType);
        const expression = new Expression(template, context, this.calculation, parser);


        return expression.run();
    }
}