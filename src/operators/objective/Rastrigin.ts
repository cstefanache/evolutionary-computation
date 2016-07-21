import {OutputField} from "../../models/FieldDef";
import {NumericField} from "../../models/FieldDef";
import {FieldDef} from "../../models/FieldDef";
import {Individual} from "../../models/Individual";
import {IndividualOperator} from "../../models/IndividualOperator";
import {Num} from "../../Num";

@Register
export class Rastrigin extends IndividualOperator {

    public static OBJ_FIELD_NAME:string = 'rastrigin';
    public static PRECISION:number = 10;

    private X_FIELD_NAME:string = 'x';
    private Y_FIELD_NAME:string = 'y';


    constructor() {
        super('Rastrigin');
    }


    execute(individual:Individual):void {
        var x = individual.getValue(this.X_FIELD_NAME);
        var y = individual.getValue(this.Y_FIELD_NAME);
        var sum:number = 0;
        var obj = 20;
        obj += x * x - (10 * Math.cos(2 * Math.PI * x));
        obj += y * y - (10 * Math.cos(2 * Math.PI * y));

        individual.setValue(Rastrigin.OBJ_FIELD_NAME, Num.roundToPrecision(obj, Rastrigin.PRECISION));

    }

    getName():string {
        return "Rastrigin";
    }

    getFieldDefinition():Array<FieldDef> {
        var x = new NumericField(this.X_FIELD_NAME, -5.12, 5.12, Rastrigin.PRECISION);
        var y = new NumericField(this.Y_FIELD_NAME, -5.12, 5.12, Rastrigin.PRECISION);
        var value = new OutputField(Rastrigin.OBJ_FIELD_NAME);

        return [x, y, value];
    }

}

