import {OutputField} from "../../models/FieldDef";
import {NumericField} from "../../models/FieldDef";
import {FieldDef} from "../../models/FieldDef";
import {Individual} from "../../models/Individual";
import {IndividualOperator} from "../../models/IndividualOperator";
import {Num} from "../../Num";

@Register
export class Schwefel extends IndividualOperator {

    public static OBJ_FIELD_NAME:string = 'schwefel';
    public static PRECISION:number = 10;

    private X_FIELD_NAME:string = 'x';
    private Y_FIELD_NAME:string = 'y';


    constructor() {
        super('Schwefel');
    }


    execute(individual:Individual):void {
        var x = individual.getValue(this.X_FIELD_NAME);
        var y = individual.getValue(this.Y_FIELD_NAME);


        var sum:number = 0;

        sum += x * Math.sin(Math.sqrt(Math.abs(x)));
        sum += y * Math.sin(Math.sqrt(Math.abs(y)));

        var value:number = sum + 2 * 4.18982887272434686131e+02;
        individual.setValue(Schwefel.OBJ_FIELD_NAME, Num.roundToPrecision(value, Schwefel.PRECISION));

    }

    getName():string {
        return "Schwefel";
    }

    getFieldDefinition():Array<FieldDef> {
        var x = new NumericField(this.X_FIELD_NAME, -500, 500, Schwefel.PRECISION);
        var y = new NumericField(this.Y_FIELD_NAME, -500, 500, Schwefel.PRECISION);
        var value = new OutputField(Schwefel.OBJ_FIELD_NAME);

        return [x, y, value];
    }

}

