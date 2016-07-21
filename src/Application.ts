import {Population} from "./models/Population";
import {Operator} from "./models/Operator";
import {GroupOperator} from "./models/GroupOperator";
import {OutputField} from "./models/FieldDef";
import {Individual} from "./models/Individual";
import {IndividualOperator} from "./models/IndividualOperator";
import {PopulationOperator} from "./models/PopulationOperator";
import {JSOperator} from "./models/Operator";
import {Log} from "./Log";
import {GuiHud} from "./hud/GuiHud";
import {FieldDef} from "./models/FieldDef";
import {Schwefel} from "./operators/objective/Schwefel";
import {Num} from "./Num";
import {MinRank} from "./operators/ranking/MinRank";
import {CanvasRenderer} from "./operators/renderers/CanvasRenderer";
import {GrimReaper} from "./operators/misc/GrimReaper";
import {RandomIndividualGenerator} from "./operators/misc/RandomIndividualGenerator";
import {PSOA} from "./operators/swarm/PSOA";
import {LinearRanking} from "./operators/ranking/LinearRanking";
import {TableRenderer} from "./operators/renderers/TableRenderer";
import {Roulette} from "./operators/selection/Roulette";
import {HauptGA} from "./operators/genetic/HauptGA";
import {PopulationSizeControl} from "./operators/misc/PopulationSizeControl";

export class Application {

    private colors:Array<string> = ['green', 'blue', 'red', 'orange', 'black', 'teal', 'pink', 'magenta', 'fuchsia'];


    constructor(callback?:Function) {
        //    Application.instance = this;

        if (callback) {
            Promise.all(Object.keys(System.defined).map((key) => {
                return System.import(key);
            })).then(() => {
                callback();
            });

        }
    }

    private populations:Array<Population> = [];
    private interval;
    private currentPopulation:Population;

    public rootOperator:Operator = new GroupOperator('root');
    public delay:number = 50;
    public populationSize:number = 100;

    public numPopulations():number {
        return this.populations.length;
    }

    public addPopulation(populationSize?:number):void {
        if (!this.rootOperator) {
            this.rootOperator = new GroupOperator("root");
        }


        var population:Population = new Population(populationSize || this.populationSize);
        population.index = this.populations.length;
        population.color = this.colors[this.populations.length];
        var that = this;
        population.rind = function () {
            return that.requestIndividual()
        };
        this.preparePopulation(this.rootOperator, population);
        this.populations.push(population);
    }

    public addOperator(operator:Operator, parent?:Operator):void {
        var host:Operator = parent !== undefined ? parent : this.rootOperator;
        host.addOperator(operator);

        console.log(operator);

        for (let population of this.populations) {
            this.preparePopulation(operator, population)
        }
    }

    public preparePopulation(operator:Operator, population:Population) {
        var defs = operator.getFieldDefinition();
        if (defs) {
            for (let fieldDef of defs) {
                population.fields.push(fieldDef.name);
                if (!(fieldDef instanceof OutputField)) {
                    population.inputFields.push(fieldDef.name);
                }

                for (let individual of population.individuals) {
                    individual.registerField(fieldDef);
                }
            }
        }

        if (operator.operators !== undefined) {
            for (let op of operator.operators) {
                this.preparePopulation(op, population);
            }
        }
    }

    public requestIndividual():Individual {
        let individual:Individual = new Individual();
        this.registerOperator(this.rootOperator, individual);
        this.currentPopulation.individuals.unshift(individual);
        return individual;
    }


    public resetPopulations():void {
        this.populations = [];
    }

    public tick():void {
        for (let pop of this.populations) {
            this.currentPopulation = pop;
            this.rootOperator.doExecute(undefined, pop);
        }

    }

    public start(numTicks?:number):void {

        if (this.interval) {
            return;
        }

        var ticks = 0;
        var that = this;
        this.interval = setInterval(function () {
            ticks++;
            that.tick();
            if (numTicks && ticks > numTicks) {
                that.stop();
            }
        }, this.delay);
    }

    public stop():void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }

    //public getOperator(name:string):Operator {
    //    var op:Operator;
    //    import TestAction = require('./action/TestAction');
    //    var myAction = new TestAction();
    //    return op;
    //}

    public registerOperator(operator:Operator, individual:Individual) {
        var defs = operator.getFieldDefinition();
        if (defs) {
            for (let fieldDef of defs) {
                individual.registerField(fieldDef);
            }
        }

        if (operator.operators) {
            for (let op of operator.operators) {
                this.registerOperator(op, individual);
            }
        }
    }

    public newJSOperator(name:string, callback:Function, isIndividual:boolean, fieldsDef?:Array<any>) {
       console.log(name);
        return new JSOperator(name, callback, isIndividual, fieldsDef);
    }


    public listOperators():Array<string> {
        var local:Array<string> = [];

        if (window && window['ops']) {
            for (let op in window['ops']) {
                local.push(op);
            }
        }

        return local;
    }

    public describeOperator(name:string):string {

        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var ARGUMENT_NAMES = /([^\s,]+)/g;

        function getParamNames(func) {
            var fnStr = func.toString().replace(STRIP_COMMENTS, '');
            var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
            if (result === null)
                result = [];
            return result;
        }

        var desc:string;

        if (window && window['ops']) {
            var operator = window['ops'][name];

            if (!operator) {
                Log.error("Unable to find operator: " + name + ". Check if it has @Register as class decorator or use application.listOperators() to check the list of all operators");
            } else {
                var funcStr = getParamNames(operator.func);
                console.log("Constructor parameters: ", funcStr);

                var instance = new operator.func();
                for (let field of instance.getFieldDefinition()) {
                    console.log(field.describe());
                }


            }
        } else {
            Log.error("Window object not found or no operators are registered");
        }

        return desc;
    }

    public createOperator(name:string, args:Array<any>):Operator {
        var op:Operator;

        if (window && window['ops']) {

            var operator = window['ops'][name];

            if (!operator) {
                Log.error("Unable to find operator: " + name + ". Check if it has @Register as class decorator or use application.listOperators() to check the list of all operators");
            } else {
                var inst = Object.create(operator.func.prototype);
                operator.func.apply(inst, args);
                op = inst;
            }
        } else {
            Log.error("Window object not found or no operators are registered");
        }

        return op;
    }

    initializeHud() {
        new GuiHud(this, this.populationSize);
    }


}
