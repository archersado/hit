import { ParserFunc } from './param_parser';
import * as is from 'is-type-of';
import Calculation from './calculation';

export enum Priority {
    LEFT_BLOCK = '(',
    RIGHT_BLOCK = ')'
}

export default class Expression {
    operatorStack: string[];
    elementStack: any[];
    expression: string;
    parser: ParserFunc;
    context: {[key: string]: any};
    calculation: Calculation;
    operators: {[key: string]: number};

    constructor(expression: string, context: {[key: string]: any}, calculation: Calculation, parser: ParserFunc) {
        this.context = context;
        this.operatorStack = [];
        this.elementStack = [];
        this.calculation = calculation;
        this.expression =  expression.replace(/\s+/g, '');;
        this.parser = parser;
        this.operators = this.calculation.getOperates();
    }

    getOperatorStackTop() {
        return this.operatorStack[0];
    }

    pushElement(element) {
        if (!element) return;
        let param = element;
        if (is.string(element)) param = this.parser(element, this.context);
        this.elementStack.unshift(param);
    }

    getOperators() {
        return Object.keys(this.operators);
    }

    compute() {
        const operator = this.operatorStack.shift();
        const right = this.elementStack.shift();
        const left = this.elementStack.shift();
        const result = this.calculation.run(operator, left, right);

        this.elementStack.unshift(result);
    }

    parseBlock(start: number) {
        let leftBlockCounts = 1;
        let rightBlockCounts = 0;
        let idx = start + 1;
        const size = this.expression.length;
        while (idx < size && rightBlockCounts < leftBlockCounts) {
            let currentChar = this.expression.charAt(idx);
            if (currentChar === Priority.LEFT_BLOCK) {
                leftBlockCounts++;
            } 
            if (currentChar === Priority.RIGHT_BLOCK) {
                rightBlockCounts++;
            }
            idx++;
        }
        if (idx === size && rightBlockCounts < leftBlockCounts) throw new Error(`表达式有误, 请检查!`);
        const mainExpression = this.expression.substring(start, idx);

        const childExpression = mainExpression.substr(1, mainExpression.length - 2);
        return [mainExpression, childExpression];
    }

    run() {
        let idx = 0;
        let currentParam = '';
        let matchOperatorList: string[] = [];
        const expressionSize = this.expression.length;

        while (idx < expressionSize) {
            const currentChar = this.expression.charAt(idx);
            console.log(idx, this.expression, currentParam, this.elementStack, this.operatorStack)

            if (currentChar === Priority.LEFT_BLOCK) {
                currentParam && this.operatorStack.unshift(currentParam);
                const [origin, childExpression] = this.parseBlock(idx);
       
                const result = new Expression(childExpression, this.context, this.calculation, this.parser).run();

                this.pushElement(result);
                this.expression = this.expression.replace(origin, '');
                currentParam = '';
                matchOperatorList = [];
                continue;
            }
            
            if (matchOperatorList.length > 0) {
                const operatorSize = currentParam.length;
                const matchItems = this.getOperators().filter(el => el.charAt(operatorSize) === currentChar);
                if (matchItems.length > 0) {
                    currentParam = `${currentParam}${currentChar}`;
                } else {
                    const operatorPriority = this.operators[currentParam];
                    const topOperator = this.getOperatorStackTop();
                    const topOperatorPriority = this.operators[topOperator] || 0;
                    if (topOperatorPriority >= operatorPriority) this.compute();
                    this.operatorStack.unshift(currentParam);
                    currentParam = currentChar;
                    matchOperatorList = [];
                }
            } else {
                const matchItems = this.getOperators().filter(el => el.charAt(0) === currentChar);
                if (matchItems.length > 0) {
                    this.pushElement(currentParam)
                    currentParam = '';
                    matchOperatorList = [ ...matchOperatorList, ...matchItems ];
                }
                currentParam = `${currentParam}${currentChar}`;
            }
            ++idx;
        }
        this.pushElement(currentParam);
        // 清空栈
        while(this.operatorStack.length > 0) {
            this.compute();
        }

        return this.elementStack[0];
    }   
}