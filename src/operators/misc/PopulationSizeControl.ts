import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {FieldDef} from "../../models/FieldDef";

@Register
export class PopulationSizeControl extends PopulationOperator {

    maxIndividuals:number;

    constructor(maxIndividuals:number) {
        super("PopualationSizeControl");
        if (!maxIndividuals) {
            throw new Error("PopulationSizeControl needs maxIndividuals parameter to be passed as argument");
        }

        this.maxIndividuals = maxIndividuals;
    }

    execute(population:Population):void {
        if (population.individuals.length > this.maxIndividuals) {
            population.individuals.splice(this.maxIndividuals, population.individuals.length - this.maxIndividuals);
        }
    }

    getFieldDefinition():Array<FieldDef> {
        return undefined;
    }

}