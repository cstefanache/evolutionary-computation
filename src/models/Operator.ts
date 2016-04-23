import {Population} from "./Population";
import {Individual} from "./Individual";
import {FieldDef} from "./FieldDef";
import {OutputField} from "./FieldDef";
import {JSField} from "./FieldDef";


export abstract class Operator {


    name:string;
    numExecutions:number = 1;
    operators:Array<Operator>;

    constructor(name:string) {
        this.name = name;
    }

    abstract getFieldDefinition():Array<FieldDef>;

    abstract doExecute(individual:Individual, population:Population):void;


    public addOperator(operator:Operator):void {
        if (this.operators === undefined) {
            this.operators = new Array();
        }

        this.operators.push(operator);
    }


}

export class JSOperator extends Operator {

    private execute:Function;
    private isIndividual:boolean;
    private fieldsDefObj:Array<any>;


    constructor(name:string, executeFunction:Function, isIndividual:boolean, fieldsDef:Array<any>) {
        super(name);
        this.execute = executeFunction;
        this.isIndividual = isIndividual;
        this.fieldsDefObj = fieldsDef;
    }


    getFieldDefinition():Array<FieldDef> {
        var arrFieldDef:Array<any>;
        
        if (this.fieldsDefObj) {
            arrFieldDef = [];
            for (let fieldDef of this.fieldsDefObj) {
                arrFieldDef.push(JSField.get(fieldDef));
            }
        }

        return arrFieldDef;
    }

    doExecute(individual:Individual, population:Population):void {
        if (this.isIndividual) {
            for (let ind of population.individuals) {
                this.execute(ind);
            }
        } else {
            this.execute(population);
        }
    }

}