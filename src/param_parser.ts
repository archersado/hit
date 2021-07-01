import * as _get from 'lodash.get';

export type ParserFunc =  (template: string, context: Object) => string;

export enum ParamPattern {
    Dollar = '$',
    MUSTACHE = '{{}}'
}


export default class ParamParser {
    parserMap: Map<string, ParserFunc>    
    constructor() {
        this.parserMap = new Map();
        this.parserMap.set(ParamPattern.Dollar, function (template: string, context: Object) {
            const isParam = namespace => /\$(.+)/.test(namespace);
            const trimed = template.trim();
            if (isParam(trimed)) {
                return _get(context, trimed.replace(/\$/g, ''));
            }

            return template;
        });
        this.parserMap.set(ParamPattern.MUSTACHE, function (template: string, context: Object) {
            const isParam = namespace => /^{{(.+)}}$/.test(namespace);
            const trimed = template.trim();
            if (isParam(trimed)) {
                return _get(context, trimed.replace(/{|}/g, '').trim());
            }

            return template;
        });
        return this;
    }


    add(pattern: string, parser: ParserFunc) {
        if (!this.parserMap.has(pattern)) {
            this.parserMap.set(pattern, parser);
        }
    }

    remove(pattern: string) {
        this.parserMap.delete(pattern);
    }


    getParser(pattern): ParserFunc {
        const parser = this.parserMap.get(pattern);

        if (!parser) throw new Error(`pattern 为 ${pattern} 的 parser未被注册，请先注册!`);

        return function(template, context) {
            try {
                return parser(template, context);
            } catch (e) {
                throw new Error(`parser解析解析失败, ${e.message || e}, 堆栈信息: ${e.stack} `);
            }
        } 
    }
}