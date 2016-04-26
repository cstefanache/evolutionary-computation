# Evolutionary Computation Benchmark

The application is intended to be used to test evolutionary algorithms and find NP-Hard problem solutions. 
For the moment the library is using for solution finding only Particle Swarm but we intend to add Genetic, Memetic, Social etc. Algorithms soon.

You can see it in action for optimising [Rastrigin](http://run.plnkr.co/plunks/UhXCUz/) and [Schwefel](http://run.plnkr.co/plunks/4lEiZy/) using Particle Swarm.

# Changes
## 24.04 
  * added Genetic Algorithm support and operators. Example: [Schwefel optimisation using GA](https://embed.plnkr.co/V7ABbK/)
  * added cache object to population in order to store volatile information
  * added option to GrimReaper to allow option to generate new individual when one is removed (by default this option is true)

# Having fun with the benchmark:

 - for a plnkr
 
 OR
 
 - install NodeJS & clone/fork the repository and run:
```
    npm install
    tsc -w
```
open index.html

# The Library

The library is intended to be used from from both Browser or Node environments. The library is implemented using Typescript but Javascript wrappers are created (see Plunker examples).

Typescript Example:
```
    var application = new Application(); // Initialize population

    if (window) {
      window['application'] = application; // Make them available on browser console
      window['num'] = Num; // Also random number generator
    }
    
    application.addPopulation(100); // Add a population of 100 individuals
    application.addPopulation(30);  // Add a population of 30 individuals
    
    
    application.addOperator(new Schwefel()); // Add Schwefel optimisation problem
    application.addOperator(new MinRank(Schwefel.OBJ_FIELD_NAME)); // Add population sorter based on Schwefel obj result
    application.addOperator(new CanvasRenderer('x', 'y', {x: [-510, 510], y: [-510, 510]})); // Add population renderer (zoomed out)
    application.addOperator(new CanvasRenderer('x', 'y', {x: [-420.98, -420.96], y: [-420.98, -420.96]})); // Add population renderer (zoomed in)
    application.addOperator(new GrimReaper(100)); // Add operator that removes "old" individuals
    application.addOperator(new RandomIndividualGenerator(5, 0.2)); // Add random individual generators (trying to add 5 each iteration with a chance of 20%)
    application.addOperator(new PSOA(Schwefel.OBJ_FIELD_NAME)); // Calculate Particle Swarm vectors

    application.initializeHud(); //Initialize the Mini-HUD for easier algorithm interactions (start/stop/reset)
```

Javascript Example:
```
    System.import('Application').then(function(module) {
     
      window.application = new module.Application(function() {
        application.addOperator(application.createOperator('Schwefel'));
        application.addOperator(application.createOperator('MinRank', ['schwefel']));
        application.addOperator(application.createOperator('CanvasRenderer', ['x', 'y', {
          x: [-510, 510],
          y: [-510, 510]
        }]));
        application.addOperator(application.createOperator('CanvasRenderer', ['x', 'y', {
          x: [-420.98, -420.96],
          y: [-420.98, -420.96]
        }]));
        application.addOperator(application.createOperator('GrimReaper', [100]));
        application.addOperator(application.createOperator('RandomIndividualGenerator', [5, 0.2]));
        application.addOperator(application.createOperator('TableRenderer', [4, false]));
        application.addOperator(application.createOperator('PSOA', ['schwefel']));

        application.addPopulation(100);
        application.addPopulation(30);
 
        application.tick();
        application.initializeHud();
      })
      
    }, function(err) {
        console.log(err)
    }).catch(console.error.bind(console));
```

# Details

The Benchmark is developed around two concepts: 
 - individuals -form populations and store state 
 - Operators: pieces of logic that form the algorithm - they have the power to alter, generate or destroy individuals or population. 
 
## Operator

Each operator definition must define the execute function. Based on the type of definition, population or individual, the execute function will receive as parameter either the entire current population or each individual.
The individual type operators are best for defining Objective functions that receive a set of parameters (x,y) and set another sed (output1, output2). The population operators are mostly used when one individual must be evaluated in relation with the rest of the population (ranking functions).
The operator can also define a set of fields that will be stored as state for each individual in the population.

Defining operators:

Typescript:
```
@Register
export class Schwefel extends IndividualOperator {

    //Extract output field as public constant
    public static OBJ_FIELD_NAME:string = 'schwefel';
    public static PRECISION:number = 10;
    
    private X_FIELD_NAME:string = 'x';
    private Y_FIELD_NAME:string = 'y';

    //Construct operator with "Schwefel" name
    constructor() {
        super('Schwefel');
    }

    //Define execution function with individual as input parameter
    execute(individual:Individual):void {
        var x = individual.getValue(this.X_FIELD_NAME); // read x value
        var y = individual.getValue(this.Y_FIELD_NAME); // read y value
     
        var sum:number = 0;

        sum += x * Math.sin(Math.sqrt(Math.abs(x)));
        sum += y * Math.sin(Math.sqrt(Math.abs(y)));

        var value:number = sum + 2 * 4.18982887272434686131e+02;
        
        //Set objective value (schwefel) field to result
        individual.setValue(Schwefel.OBJ_FIELD_NAME, Num.roundToPrecision(value, Schwefel.PRECISION));
    }

    //@deprecated
    getName():string {
        return "Schwefel";
    }

    //Return field definition needed by the algorithm 
    getFieldDefinition():Array<FieldDef> {
        var x = new NumericField(this.X_FIELD_NAME, -500, 500, Schwefel.PRECISION);
        var y = new NumericField(this.Y_FIELD_NAME, -500, 500, Schwefel.PRECISION);
        var value = new OutputField(Schwefel.OBJ_FIELD_NAME);
        return [x, y, value];
    }

}
```

Javascript:
```
    application.newJSOperator('schwefel', function (individual) {
      var x = individual.getValue('x');
      var y = individual.getValue('y');
    
      var sum = x * Math.sin(Math.sqrt(Math.abs(x)));
      sum += y * Math.sin(Math.sqrt(Math.abs(y)));
      
      var value:number = sum + 2 * 4.18982887272434686131e+02;
    
      individual.setValue('schwefel', value, 6);
    }, true, [
      {name: 'x', numeric: {min: -500, max: 500, precision: 4}},
      {name: 'y', numeric: {min: -500, max: 500, precision: 4}},
      {name: 'schwefel'},
    ])
```


# API

The Benchmark is developed with extension in mind. The framework offers an API for testing algorithms.

  * addPopulation(*populationSize*) - adds a new population to the set with *populationSize* if defined, 100 otherwise
  * numPopulations() - returns the number of individuals
  * requestIndividual() - creates, register to the current population, prepare and return a new individual
  * removeIndividual(*individual*) - removes provided *individual* from the current population
  * resetPopulations() - clears populations
  * tick() - run an evolution cycle
  * start(*numTicks*) - start evolutionary process. If *numTicks* is provided then it will execute as many cycles as passed as parameter
  * stop() - stops evolutionary process
  * listOperators() - [JS] lists known operators 
  * describeOperator(*name*) - [JS] describes (parameters and fields) operator found for *name*
  * createOperator(*operatorName*, *parameters*) - [JS] used to create an instance of the *operatorName* with the provided set of *parameters*
  * addOperator(*operator*, *parent*) - adds the *operator* to the current evolutionary algorithm. Since the operators can be grouped a *parent* can be passed. If there is no parent defined the operator will be added to the root group


Contributions and suggestions are welcome.

