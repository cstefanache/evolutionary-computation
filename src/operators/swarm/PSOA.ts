import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {FieldDef} from "../../models/FieldDef";
import {OutputField} from "../../models/FieldDef";
import {Individual} from "../../models/Individual";
import {Num} from "../../Num";

@Register
export class PSOA extends PopulationOperator {


    private fitness:string;

    constructor(fitness:string) {
        super('PSOA');
        this.fitness = fitness;
    }

    execute(population:Population):void {

        //assuming that is already ranked
        var best = population.individuals[0].getValue("PSOData");

        var omega:number = 0.85;
        var c1:number = 0.1;
        var c2:number = 0.1;


        for (let i = 0; i < population.individuals.length; i++) {

            var currentIndividual:Individual = population.individuals[i];
            var psoData = currentIndividual.getValue("PSOData");


            for (let field of population.inputFields) {
                var pb = psoData[field];

                if (!pb || currentIndividual.getValue(this.fitness) < psoData[this.fitness]) {
                    var currentValue = currentIndividual.getValue(field);
                    psoData[field] = pb = currentValue;
                }
            }
            psoData[this.fitness] = currentIndividual.getValue(this.fitness);

            for (let field of population.inputFields) {
                var pb = psoData[field];
                var velocityKey = 'v.' + field;
                //x,y,z
                var currentValue = currentIndividual.getValue(field);
                var velocity = psoData[velocityKey];

                if (velocity === undefined) {
                    psoData[velocityKey] = velocity = 0;
                }

                psoData[velocityKey] = omega * velocity + (c1 * Num.getRandomNum() * (pb - currentValue)) + (c2 * Num.getRandomNum() * (best[field] - currentValue));
                currentIndividual.setValue(field, currentValue + psoData[velocityKey]);
            }
        }
    }

    getFieldDefinition():Array<FieldDef> {
        return [new OutputField("PSOData", {})];
    }

}