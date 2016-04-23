import {Operator} from "./Operator";
import {Individual} from "./Individual";
import {Population} from "./Population";
import {FieldDef} from "./FieldDef";
export abstract class IndividualOperator extends Operator {



    doExecute(individual:Individual, population:Population):void {
        for (let ind of population.individuals) {
            this.execute(ind);
        }
    }

    abstract execute(individual:Individual):void;

}

