import {Population} from "./Population";
import {Individual} from "./Individual";
import {Operator} from "./Operator";
export abstract class PopulationOperator extends Operator {

    doExecute(individual:Individual, population:Population):void {
        this.execute(population);
    }

    abstract execute(population:Population):void;


}