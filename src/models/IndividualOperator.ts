import {Operator} from "./Operator";
import {Individual} from "./Individual";
import {Population} from "./Population";
import {FieldDef} from "./FieldDef";

@Register
export abstract class IndividualOperator extends Operator {



    doExecute(individual:Individual, population:Population):void {
        this.currentRunning = population;
        for (let ind of population.individuals) {
            this.execute(ind);
        }
    }

    abstract execute(individual:Individual):void;

}

