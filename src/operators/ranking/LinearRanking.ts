import {PopulationOperator} from "../../models/PopulationOperator";
import {FieldDef} from "../../models/FieldDef";
import {OutputField} from "../../models/FieldDef";
import {Population} from "../../models/Population";
import {Individual} from "../../models/Individual";
import {Num} from "../../Num";

@Register
export class LinearRanking extends PopulationOperator {

    private fieldSort:string;

    constructor(fieldSort:string) {
        super("LinearRanking");
        this.fieldSort = fieldSort;
    }

    execute(population:Population):void {
        population.individuals = _.sortBy(population.individuals, ind => {
            return ind.getValue(this.fieldSort);
        });

        var size:number = population.individuals.length;
        for (var i = 0; i < size; i++) {
            var individual:Individual = population.individuals[i];
            individual.setValue("linearRanking", Num.roundToPrecision( (2 * size + 1 - 2 * i) / size / size, 2));
        }
    }

    getFieldDefinition():Array<FieldDef> {
        return [new OutputField("linearRanking", 0)];
    }

}
