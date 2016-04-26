///<reference path="../models/FieldDef.ts"/>


import {IndividualOperator} from "../models/IndividualOperator";
import {FieldDef} from "../models/FieldDef";
import {StrField} from "../models/fields/StrField";
import {OutputField} from "../models/FieldDef";
import {Individual} from "../models/Individual";
export class SumFunction extends IndividualOperator {

    constructor() {
        super('SumFunctionOperator');
    }

    getFieldDefinition():Array<FieldDef> {
        return [new StrField('content', 1, 10), new OutputField('obj')];
    }

    execute(individual:Individual):void {
        var func = individual.getValue('content');
        var value = 0;
        var x = 3;
        var y = 4;

        var parameters = ['x', 'y'];

        try {
            //var timestamp = new Date().getTime();
            var result = eval(func);
            value = Math.abs(result - 7);
        } catch (err) {
            value += 1e3 - result.length;
        }

        for (let param of parameters) {
            if (func.indexOf(param) === -1) {
                value += 50;
            }
        }


        individual.setValue('obj', value);
    }

}



