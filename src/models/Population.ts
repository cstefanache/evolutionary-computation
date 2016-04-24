import {Individual} from "./Individual";
import {Num} from "../Num";
export class Population {

    individuals:Array<Individual>;
    fields:Array<string>;
    inputFields:Array<string>;
    color:string;
    cache:any;
    rind:Function;
    index:number;

    constructor(numIndividuals?:number) {
        this.fields = [];
        this.inputFields = [];
        this.individuals = [];
        this.cache = {};
        
        if (numIndividuals) {
            for (let i = 0; i < numIndividuals; i++) {
                this.individuals.unshift(new Individual());
            }
        }
    }

    public requestIndividual():Individual {
        return this.rind();
    }

    public removeIndividual(individual:Individual):void {
        let individuals = this.individuals;
        individuals.splice(individuals.indexOf(individual), 1);
    }


}

