import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {FieldDef} from "../../models/FieldDef";
import {OutputField} from "../../models/FieldDef";


@Register
export class MinRank extends PopulationOperator {

    static FIELD:string = 'rank';

    private fieldSort:string;

    constructor(fieldSort:string) {
        super("MinRank");
        this.fieldSort = fieldSort;
    }

    execute(population:Population):void {
        population.individuals = _.sortBy(population.individuals, ind => {
            return ind.getValue(this.fieldSort);
        });

        _.each(population.individuals, (ind, index) => {
            ind.setValue(MinRank.FIELD, index);
        });
    }

    getFieldDefinition():Array<FieldDef> {
        return [new OutputField(MinRank.FIELD, 0)];
    }

}
