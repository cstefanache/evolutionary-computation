import {IndividualOperator} from "../../models/IndividualOperator";
import {Individual} from "../../models/Individual";
import {FieldDef} from "../../models/FieldDef";
import {OutputField} from "../../models/FieldDef";
import {Num} from "../../Num";
import {Application} from "../../Application";

@Register
export class GrimReaper extends IndividualOperator {

    private avgAge:number;

    constructor(avgAge?:number) {
        super('GrimReaper');
        this.avgAge = avgAge || 100;
    }

    execute(individual:Individual):void {
        var age = individual.getValue("age");
        if (Num.getRandomNum() < age/this.avgAge) {
            Application.instance.removeIndividual(individual);
        }
    }


    getFieldDefinition():Array<FieldDef> {
        return [new OutputField("age", 1)];

    }

}