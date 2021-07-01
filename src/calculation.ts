export const Operators = {
    PLUS: ['+',  14 ],
    MINUS: ['-', 14],
    MULTIPLY: ['*', 15],
    DIVIDE: ['/', 15],
    AND: ['&&', 7],
    OR: ['||', 6],
    XOR: ['^', 9],
    BOR: ['|', 8],
    GT: ['>', 12],
    GTE: ['>=', 12],
    LT: ['<', 12],
    LTE: ['<=', 12],
    EQUALS: ['==', 11],
    SAME: ['===', 11],
    NOT_EQUALS: ['!=', 11],
    NOT_SAME: ['!==', 11],
}

type CalculateFunc =  (left, right) => any;


export default class Calculation {
    calculateMap: Map<string, CalculateFunc>;
    operators: {[key: string]: number};
    constructor() {
        this.operators = {};
        this.calculateMap = new Map();
        for (const key in Operators) {
            const enumValue = Operators[key];
            const [value, priority] = enumValue;
            let calculation;
            switch (value) {
                case Operators.PLUS[0]:
                    calculation = function(left, right) {
                        if (isNaN(+left) || isNaN(+right)) {
                            return left + right;
                        }

                        return (+left) + (+right);
                    }
                    break;
                case Operators.MINUS[0]:
                    calculation = function(left, right) {
                        return (+left) - (+right);
                    };
                    break;
                case Operators.MULTIPLY[0]:
                    calculation = function(left, right) {
                        return +left * +right;
                    };
                    break;
                case Operators.DIVIDE[0]:
                    calculation = function(left, right) {
                        return +left/ +right;
                    };
                    break;
                case Operators.AND[0]:
                    calculation = function(left, right) {
                        return !!left && !!right;
                    };
                    break;
                case Operators.OR[0]:
                    calculation = function(left, right) {
                        return !!left || !!right;
                    };
                    break;
                case Operators.XOR[0]:
                    calculation = function(left, right) {
                        return left ^ right;
                    };
                    break;
                case Operators.BOR[0]:
                    calculation = function(left, right) {
                        return left | right;
                    };
                    break;
                case Operators.GT[0]:
                    calculation = function(left, right) {
                        return left > right;
                    };
                    break;
                case Operators.LT[0]:
                    calculation = function(left, right) {
                        return left < right;
                    };
                    break;
                case Operators.GTE[0]:
                    calculation = function(left, right) {
                        return left >= right;
                    };
                    break;
                case Operators.LTE[0]:
                    calculation = function(left, right) {
                        return left <= right;
                    };
                    break;
                case Operators.EQUALS[0]:
                    calculation = function(left, right) {
                        return left == right;
                    };
                    break;
                case Operators.SAME[0]:
                    calculation = function(left, right) {
                        return left === right;
                    };
                    break;
                case Operators.NOT_EQUALS[0]:
                    calculation = function(left, right) {
                        return left != right;
                    };
                    break; 
                case Operators.NOT_SAME[0]:
                    calculation = function(left, right) {
                        return left !== right;
                    };
                    break;                    
                default:
                    break;
            }
            if (calculation) {
                this.operators[value] = priority;
                this.calculateMap.set(value, calculation);
            }
        }
        return this;
    }

    getOperates() {
        return this.operators;
    }

    add(operator: string, calculate: CalculateFunc) {
        if (!this.calculateMap.has(operator)) {
            this.calculateMap.set(operator, calculate);
        }
        this.calculateMap.set(operator, calculate);
    }

    remove(operator: string) {
        this.calculateMap.delete(operator);
    }


    run(operator, left, right) {
        const calculation = this.calculateMap.get(operator);

        if (!calculation) throw new Error(`operator 为 ${operator} 的 计算未被注册，请先注册!`);

        try {
            return calculation(left, right);
        } catch (e) {
            throw new Error(`计算失败, ${e.message || e}, 堆栈信息: ${e.stack} `);
        }
    }

}