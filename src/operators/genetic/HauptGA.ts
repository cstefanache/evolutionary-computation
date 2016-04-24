import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {FieldDef} from "../../models/FieldDef";
import {Num} from "../../Num";
import {Individual} from "../../models/Individual";
import {FieldType} from "../../models/FieldDef";
export class HauptGA extends PopulationOperator {


    private cp:number = 0.1;
    private mp:number = 0.1;

    constructor(crossoverProbability:number = 0.3, mutationProbabiliy:number = 0.1) {
        super('HauptGA');
        this.cp = crossoverProbability;
        this.mp = mutationProbabiliy;
    }

    execute(population:Population):void {

        var selection:Array<Individual> = population.cache['selection'];

        var child1:Individual = population.requestIndividual();
        var child2:Individual = population.requestIndividual();

        var parent1:Individual = selection[0];
        var parent2:Individual = selection[1];

        for (let field of population.inputFields) {

            var fieldDef:FieldDef = parent1.getFieldDefinition(field);

            //Apply only on numeric fields
            if (fieldDef.type !== FieldType.NUMERIC) {

                var parent1Value = parent1.getValue(field);
                var parent2Value = parent2.getValue(field);
                var crossoverValue = this.hauptCrossover(parent1Value, parent2Value);

                if (Num.getRandomNum() < this.cp) {
                    child1.setValue(field, crossoverValue[0]);
                    child2.setValue(field, crossoverValue[1]);
                } else {
                    child1.setValue(field, parent1Value);
                    child2.setValue(field, parent2Value);
                }

                if (Num.getRandomNum() < this.mp) {
                    child1.setValue(field, this.hauptMutation(fieldDef.min, fieldDef.max));
                }
            }

        }

    }

    getFieldDefinition():Array<FieldDef> {
        return undefined;
    }

    private hauptCrossover(value1:number, value2:number):Array<number> {
        if (_.isNumber(value1) && _.isNumber(value1)) {
            var beta = Num.getRandomNum();
            return [beta * value1 + (1 - beta) * value2, (1 - beta) * value1 + beta * value2];
        } else {
            return [value1, value2];
        }

    }


    private hauptMutation(gmin:number, gmax:number):number {
        return gmin + Num.getRandomNum() * (gmax - gmin)
    }


}