import {Operator} from "./Operator";
import {FieldDef} from "./FieldDef";
import {Individual} from "./Individual";
import {Population} from "./Population";

export class GroupOperator extends Operator {

    constructor(name) {
        super(name);
    }

    getFieldDefinition():Array<FieldDef> {
        return [];
    }

    doExecute(individual:Individual, population:Population):void {
        if (!this.operators)
            return;
        for (var i = 0; i < this.numExecutions; i++) {
            for (let operator of this.operators) {
                operator.doExecute(individual, population);
            }
        }
    }
}
