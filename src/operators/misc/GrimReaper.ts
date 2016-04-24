import {IndividualOperator} from "../../models/IndividualOperator";
import {Individual} from "../../models/Individual";
import {FieldDef} from "../../models/FieldDef";
import {OutputField} from "../../models/FieldDef";
import {Num} from "../../Num";
import {Application} from "../../Application";

@Register
export class GrimReaper extends IndividualOperator {

    private avgAge:number;
    private regenerate:boolean;

    constructor(avgAge?:number, regenerate:boolean = true) {
        super('GrimReaper');
        this.avgAge = avgAge || 100;
        this.regenerate = regenerate;
    }

    execute(individual:Individual):void {
        var age = individual.getValue("age");
        var rand = Num.getRandomNum();
        if (rand < age/this.avgAge) {
            this.getCurrentPopulation().removeIndividual(individual);
            if (this.regenerate)
                this.getCurrentPopulation().requestIndividual();
        }

        individual.setValue("age", age+1);
    }


    getFieldDefinition():Array<FieldDef> {
        return [new OutputField("age", 1)];

    }

}