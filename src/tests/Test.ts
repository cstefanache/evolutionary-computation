

import {Application} from "../Application";
import {Num} from "../Num";
import {ArrFunction} from "./ArrFunc";
import {LinearRanking} from "../operators/ranking/LinearRanking";
import {TableRenderer} from "../operators/renderers/TableRenderer";
import {GroupOperator} from "../models/GroupOperator";
import {Roulette} from "../operators/selection/Roulette";
import {StringGA} from "../operators/genetic/StringGA";
import {PopulationSizeControl} from "../operators/misc/PopulationSizeControl";
var application = new Application(); // Initialize population

if (window) {
    window['application'] = application; // Make them available on browser console
    window['num'] = Num; // Also random number generator
}


application.addPopulation(500);  // Add a population of 30 individuals


application.addOperator(new ArrFunction()); // Add Schwefel optimisation problem
application.addOperator(new LinearRanking('obj'));
application.addOperator(new TableRenderer(10));

var groupOperator = new GroupOperator("Group Operator", 50);
groupOperator.addOperator(new Roulette('linearRanking'));
groupOperator.addOperator(new StringGA('content', 0.1, 0.2));
application.addOperator(groupOperator);

application.addOperator(new PopulationSizeControl(500));
application.initializeHud(); //Initialize the Mini-HUD for easier algorithm interactions (start/stop/reset)
application.tick();



