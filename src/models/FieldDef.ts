import {Num} from "../Num";

export class FieldType {
    static NUMERIC:number = 0;
    static ANY:number = 1;
}

export abstract class FieldDef {
    name:string;
    value:any;
    type:number = -1;
    defaultValue:any;
    min:number;
    max:number;
    precision:number;


    constructor(name:string, defaultValue?:any) {
        this.name = name;
        this.value = this.defaultValue = defaultValue;
    }

    filter(value:any):any {
        return value;
    }

    abstract getInitialValue():any;

    describe():string {
        var definition:string = "Declares: " + this.name;
        if (this instanceof OutputField) {
            definition += " as output field";
            if (this.defaultValue !== undefined) {
                definition += " with " + this.defaultValue + " as default value";
            }
        } else {
            definition += " as field with (";
            definition += this.min !== undefined ? " min:" + this.min : "";
            definition += this.max !== undefined ? " max:" + this.max : "";
            definition += this.precision !== undefined ? " precision:" + this.precision : "";
            definition += ")";
        }

        return definition;
    }

}


export class OutputField extends FieldDef {

    getInitialValue():any {
        return _.clone(this.value);
    }

    constructor(name:string, defaultValue?:any) {
        super(name, defaultValue);
        this.type = FieldType.ANY;
    }
}

export class NumericField extends FieldDef {


    constructor(name:string, min:number, max:number, precision:number = 6, defaultValue?:any) {
        super(name, defaultValue);
        this.min = min;
        this.max = max;
        this.precision = precision;
        this.defaultValue = defaultValue;
        this.type = FieldType.NUMERIC;
    }

    filter(value:number):any {

        if (this.min !== undefined && value < this.min) {
            return this.min;
        }
        if (this.max !== undefined && value > this.max) {
            return this.max;
        }

        if (this.precision !== undefined) {
            return Num.roundToPrecision(value, this.precision);
        }

        return value;
    }

    getInitialValue():any {
        if (this.defaultValue === undefined) {
            return Num.getRandomNum(this.min, this.max, this.precision);
        }
    }
}

export class JSField {

    static get(config:any):FieldDef {

        if (!config.name) {
            throw new Error("JSField must be initialized with a name.");
        }

        var field:FieldDef;
        if (config.numeric) {
            var numData:any = config.numeric;
            if (!numData.min || !numData.max) {
                throw new Error("Please provide min and max value for numeric field [" + config.name + "].");
            }

            field = new NumericField(config.name, numData.min, numData.max, numData.precision, config.defaultValue)
        } else {
            field = new OutputField(config.name, config.defaultValue);
        }

        return field;
    }


}
