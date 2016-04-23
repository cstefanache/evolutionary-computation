import {Individual} from "./Individual";
import {Num} from "../Num";
export class Population {

    individuals:Array<Individual>;
    fields:Array<string>;
    inputFields:Array<string>;
    color:string;

    constructor(numIndividuals?:number) {
        this.fields = [];
        this.inputFields = [];
        this.individuals = [];
        if (numIndividuals) {
            for (let i = 0; i < numIndividuals; i++) {
                this.individuals.push(new Individual());
            }
        }
    }


}

