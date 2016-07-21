import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {FieldDef} from "../../models/FieldDef";
import {Num} from "../../Num";
import {Individual} from "../../models/Individual";
import {FieldType} from "../../models/FieldDef";
import {CSSField} from "../../models/fields/CSSField";

@Register
export class CSSGAOperator extends PopulationOperator {
    tags:Array<string>;

    constructor(id:string,
                private ruleAditionProbability:number = 0.4,
                private ruleRemovalProbability:number = 0.05,
                private propertyAlterProbability:number = 0.4,
                private propertyAdditionProbability:number = 0.2,
                private propertyRemovalProbability:number = 0.2) {
        super('CSSGAOperator');
        this.tags = CSSField.getTagsList(id);
    }

    execute(population:Population):void {

        var selection:Array<Individual> = population.cache['selection'];

        var child1:Individual = population.requestIndividual();
        var child2:Individual = population.requestIndividual();

        var parent1:Individual = selection[0];
        var parent2:Individual = selection[1];


        var parent1CSSObject:Array = parent1.getValue('css');
        var parent2CSSObject:Array = parent2.getValue('css');


        var location = Num.randomInt(1, Math.min(parent1CSSObject.length, parent2CSSObject.length) - 1);

        if (location > 0) {
            var end1 = parent1CSSObject.splice(location);
            var end2 = parent2CSSObject.splice(location);
            parent1CSSObject.concat(end2);
            parent2CSSObject.concat(end1);
        }


        //console.log(CSSField.getFullCSSString(parent1CSSObject));
        this.mutate(parent1CSSObject);
        this.mutate(parent2CSSObject);
        //console.log(CSSField.getFullCSSString(parent1CSSObject));

        child1.setValue('css', parent1CSSObject);
        child2.setValue('css', parent2CSSObject);

        //console.log(parent1.getValue('css'));
        //console.log(child1.getValue('css'));
        //console.log("------");
    }

    mutate(properties:Array) {
        try {


            if (properties.length === 0 || Num.getRandomNum() < this.ruleAditionProbability) {
                properties.push(CSSField.buildSingleCSS(this.tags));
                return;
            }

            var selectedRule = Num.randomInt(0, properties.length - 1);
            var defs = properties[selectedRule].def;
            var selectedProp = Num.randomInt(0, defs.length - 1);

            if (defs.length === 0 || Num.getRandomNum() < this.ruleRemovalProbability && properties.length > 1) {
                properties.splice(selectedRule, 1);
            }

            if (Num.getRandomNum() < this.propertyAlterProbability) {
                defs[selectedProp].value = CSSField.getCSSValueForProp(defs[selectedProp].property);
            }
            if (Num.getRandomNum() < this.propertyAdditionProbability) {
                var rule = CSSField.getSingleCSSRule();
                var found;
                for (var i = 0; i < defs.length; i++) {
                    if (defs[i].property === rule.property) {
                        found = defs[i];
                        break;
                    }
                }
                if (found) {
                    found.value = rule.value;
                } else {
                    defs.push(rule);
                }

            }
            if (Num.getRandomNum() < this.propertyRemovalProbability) {
                defs.splice(selectedProp, 1);
            }


        } catch (e) {
            console.log(properties, defs, selectedRule, selectedProp);
        }

    }

    getCSSString(arr:Array<any>):string {
        var val = "";
        arr.forEach(obj => {
            val += obj.def + "{" + obj.val.join(";") + "}"
        });
        return val;
    }

    getCSSArray(cssString:string):Array<any> {
        var cssObject = [];
        var m;
        var re:RegExp = /(.*?){(.*?)}/gm;
        while ((m = re.exec(cssString)) !== null) {
            if (m.index === re.lastIndex) {
                re.lastIndex++;
            }
            cssObject.push({def: m[1].trim(), val: m[2].trim().split(";")});
        }

        return cssObject;

    }

    getFieldDefinition():Array<FieldDef> {
        return undefined;
    }

    private hauptCrossover(value1:number, value2:number):Array<number> {
        if (_.isNumber(value1) && _.isNumber(value1)) {
            var beta = Num.getRandomNum();
            return [beta * value1 + (1 - beta) * value2, (1 - beta) * value1 + beta * value2];
        } else {
            return [value1, value2];
        }

    }


    private hauptMutation(gmin:number, gmax:number):number {
        return gmin + Num.getRandomNum() * (gmax - gmin)
    }


}