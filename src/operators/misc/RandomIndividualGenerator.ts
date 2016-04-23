import {IndividualOperator} from "../../models/IndividualOperator";
import {Individual} from "../../models/Individual";
import {FieldDef} from "../../models/FieldDef";
import {OutputField} from "../../models/FieldDef";
import {Num} from "../../Num";
import {Application} from "../../Application";
import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";


@Register
export class RandomIndividualGenerator extends PopulationOperator {

    private num:number;
    private chance:number;

    constructor(generateNum:number = 5, chance:number = 0.1) {
        super("Random Individual Generator");
        this.num = generateNum;
        this.chance = chance;
    }

    execute(population:Population):void {
        for (var i = 0; i < this.num; i++) {
            if (Num.getRandomNum() < this.chance) {
                Application.instance.requestIndividual();
            }
        }
    }

    getFieldDefinition():Array<FieldDef> {
        return undefined;
    }


}