import {FieldDef} from "../../models/FieldDef";
import {StrField} from "../../models/fields/StrField";
import {Num} from "../../Num";
import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {Individual} from "../../models/Individual";
import {JSCodeField} from "../../models/fields/JSCodeField";
@Register
export class StringGA extends PopulationOperator {


    constructor(public field, public crossoverChance = 0.2, public mutationChance = 0.5) {
        super('StringGA');
    }

    execute(population:Population):void {


        var selection:Array<Individual> = population.cache['selection'];


        var parent1:Individual = selection[0];
        var parent2:Individual = selection[1];


        var valueParent1 = parent1.getValue(this.field);
        var valueParent2 = parent2.getValue(this.field);

        if (valueParent1 === valueParent2)
            return;

        var crossoverPoint = Num.getRandomNum(0, Math.min(valueParent1.length, valueParent2.length), 0);

        var crossoverValue1:string = "";
        var crossoverValue2:string = "";

        var oneToOne = true;
        for (var i = 0; i < Math.max(valueParent1.length, valueParent2.length); i++) {

            if (i < valueParent1.length && i < valueParent2.length && Num.getRandomNum() < this.crossoverChance)
                oneToOne = !oneToOne;

            var vp1 = valueParent1.length <= i ? '' : valueParent1[i];
            var vp2 = valueParent2.length <= i ? '' : valueParent2[i];

            crossoverValue1 += oneToOne ? vp1 : vp2;
            crossoverValue2 += oneToOne ? vp2 : vp1;
        }


        //var crossoverValue1 = valueParent1.substr(0, crossoverPoint) + valueParent2.substr(crossoverPoint, valueParent2.length - crossoverPoint);
        //var crossoverValue2 = valueParent2.substr(0, crossoverPoint) + valueParent1.substr(crossoverPoint, valueParent1.length - crossoverPoint);

        crossoverValue1 = this.mutate(crossoverValue1);
        crossoverValue2 = this.mutate(crossoverValue2);


        if (crossoverValue1.trim() !== "" && crossoverValue1 != valueParent1 && crossoverValue1 != valueParent2) {
            var child1:Individual = population.requestIndividual();
            child1.setValue(this.field, crossoverValue1);
        }

        if (crossoverValue2.trim() !== "" && crossoverValue1 != valueParent1 && crossoverValue1 != valueParent2) {
            var child2:Individual = population.requestIndividual();
            child2.setValue(this.field, crossoverValue2);
        }

    }


    private mutate(str:string):string {
        var result = str;
        if (Num.getRandomNum() < this.mutationChance) {

            var res = Num.getRandomNum(0, 7, 0);
            var position = Num.getRandomNum(0, str.length, 0);
            var remainingLength = str.length - position;
            var randomLength = Num.randomInt(0, str.length - position);

            switch (res) {
                //remove one char
                case (0):
                    result = str.slice(0, position) + str.slice(position + 1);
                    break;

                //add one char
                case (1):
                    result = str.slice(0, position) + str.slice(position + 1);
                    break;

                //prefix
                case (2):
                    result = str.slice(0, position);
                    break;

                //suffix
                case (3):
                    result = str.slice(position);
                    break;

                //within
                case (4):
                    result = str.substr(position, remainingLength);
                    break;

                case (5):
                    result = str.slice(0, position) + str.slice(position + randomLength);
                    break;


                case (6):
                    result = str.slice(0, position) + StrField.getRandomChar() + str.slice(position);
                    break;

                case (7):
                    result = str.slice(0, position) + new JSCodeField("test").getBlock() + str.slice(position);
                    break;

            }

        }
        return result;
    }

    getFieldDefinition():Array<FieldDef> {
        return undefined;
    }


}