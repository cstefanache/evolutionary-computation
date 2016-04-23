import {OutputField} from "../../models/FieldDef";
import {NumericField} from "../../models/FieldDef";
import {FieldDef} from "../../models/FieldDef";
import {Individual} from "../../models/Individual";
import {IndividualOperator} from "../../models/IndividualOperator";
import {Num} from "../../Num";

@Register
export class Weierstrass extends IndividualOperator {

    public static OBJ_FIELD_NAME:string = 'weierstrass';
    public static PRECISION:number = 6;

    private X_FIELD_NAME:string = 'x';
    private Y_FIELD_NAME:string = 'y';
    private a:number;
    private b:number;
    private kMax:number;
    private constant:number;

    constructor() {
        super('Weierstrass');
        this.a = 0.5;
        this.b = 3.0;
        this.kMax = 20;

        var tmp:number = 0.0;

        for (var k = 0; k <= this.kMax; k++) {
            tmp += Math.pow(this.a, k) * Math.cos(2 * Math.PI * Math.pow(this.b, k) * 0.5);
        }

        this.constant = tmp;

    }


    execute(individual:Individual):void {
        var x = individual.getValue(this.X_FIELD_NAME);
        var y = individual.getValue(this.Y_FIELD_NAME);


        var tmp:number = 0;


        for (let k = 0; k <= this.kMax; k++) {
            tmp += Math.pow(this.a, k) * Math.cos(2 * Math.PI * Math.pow(this.b, k) * (x + 0.5));
        }

        for (let k = 0; k <= this.kMax; k++) {
            tmp += Math.pow(this.a, k) * Math.cos(2 * Math.PI * Math.pow(this.b, k) * (y + 0.5));
        }


        var value:number = tmp - 2 * this.constant;
        individual.setValue(Weierstrass.OBJ_FIELD_NAME, Num.roundToPrecision(value, Weierstrass.PRECISION));

    }

    getName():string {
        return "Weierstrass";
    }

    getFieldDefinition():Array<FieldDef> {
        var x = new NumericField(this.X_FIELD_NAME, 0, 2, Weierstrass.PRECISION);
        var y = new NumericField(this.Y_FIELD_NAME, 0, 2, Weierstrass.PRECISION);
        var value = new OutputField(Weierstrass.OBJ_FIELD_NAME);

        return [x, y, value];
    }

}

