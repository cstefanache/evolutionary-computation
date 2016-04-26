
import {IndividualOperator} from "../models/IndividualOperator";
import {FieldDef} from "../models/FieldDef";
import {JSCodeField} from "../models/fields/JSCodeField";
import {OutputField} from "../models/FieldDef";
import {Individual} from "../models/Individual";
export class ArrFunction extends IndividualOperator {

    keywords:Array<string> = ["abstract", "arguments", "boolean", "break", "byte", "case", "catch", "char", "class*", "const", "continue",
        "debugger", "default", "delete", "do", "double", "else", "enum*", "eval",
        "export*", "extends*", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import*",
        "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private",
        "protected", "public", "return", "short", "static", "super*", "switch", "synchronized", "this", "throw", "throws", "transient",
        "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"];

    definitions:Array<RegExp> = [/\\[.*\\]/, /\(.*\)/, /{.*}/];

    constructor() {
        super('ArrFunction');
    }

    getFieldDefinition():Array<FieldDef> {
        return [new JSCodeField('content', 2, 6), new OutputField('obj', -1)];
    }

    execute(individual:Individual):void {

        var obj = individual.getValue('obj');
        if (obj !== -1) {
            return;
        }

        var func = individual.getValue('content');
        var value = 0;


        try {
            var res = eval(func);
            if (!Array.isArray(res)) {
                value += 1e5;
            } else {
                value = 100;

                var last = res[0];


                if (_.isNumber(last) && last < 10) {
                    value--;
                }

                for (var i = 1; i < res.length; i++) {
                    var val = res[i];
                    if (_.isNumber(val)) {
                        value -= res[i] > last ? (res[i] - last === 1 ? -4 : -2) : -1;
                    } else {
                        value += 2;
                    }
                    last = res[i];
                }
            }


        } catch (err) {
            value += 1e6 - func.length;


            for (let key in this.keywords) {
                if (func.indexOf(key) !== -1) {
                    value--;
                }
            }

            for (let i = 0; i < this.definitions.length; i++) {
                if (func.match(this.definitions[i])) {
                    value--;
                }
            }
        }


        individual.setValue('obj', value);
    }

}
