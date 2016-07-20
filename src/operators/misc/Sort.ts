import {IndividualOperator} from "../../models/IndividualOperator";
import {Individual} from "../../models/Individual";
import {FieldDef} from "../../models/FieldDef";
import {OutputField} from "../../models/FieldDef";
import {Num} from "../../Num";
import {Application} from "../../Application";
import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {NumericField} from "../../models/FieldDef";

@Register
export class Sort extends PopulationOperator {

    static FIELD:string = "sortOrder";

    constructor(public field:string, public desc:boolean = false) {
        super("Sort");
    }

    execute(population:Population):void {
        population.individuals.sort((a:Individual, b:Individual)=> {
            var val = a.getValue(this.field) > b.getValue(this.field) ? -1 : 1;
            return this.desc ? val : -val;
        });


        for (var i = 0; i < population.individuals.length; i++) {
            population.individuals[i].setValue(Sort.FIELD, i);
        }

    }

    getFieldDefinition():Array<FieldDef> {
        return [new OutputField(Sort.FIELD, 0)];
    }


}