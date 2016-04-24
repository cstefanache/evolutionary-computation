import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {FieldDef} from "../../models/FieldDef";
import {Num} from "../../Num";
import {Individual} from "../../models/Individual";

@Register
export class Roulette extends PopulationOperator {

    rankField:string;
    numSelected:number;

    constructor(rankField:string, numSelected:number = 2) {
        super("Roulette");
        this.rankField = rankField;
        this.numSelected = numSelected;
    }

    execute(population:Population):void {
        var selection = [];
        var individual:Individual;


        for (var i = 0; i < this.numSelected; i++) {
            var rand = Num.getRandomNum();
            var index = 0;
            while (rand > 0 && index < population.individuals.length) {
                individual = population.individuals[index];
                var fitness = individual.getValue(this.rankField);
                rand -= fitness;

                index++;
            }

            selection.push(individual);
        }

        population.cache['selection'] = selection;
    }

    getFieldDefinition():Array<FieldDef> {
        return undefined;
    }

}