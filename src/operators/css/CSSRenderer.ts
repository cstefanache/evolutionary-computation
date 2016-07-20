import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {FieldDef} from "../../models/FieldDef";
import {Num} from "../../Num";
import {Individual} from "../../models/Individual";
import {FieldType} from "../../models/FieldDef";
import {IndividualOperator} from "../../models/IndividualOperator";
import {OutputField} from "../../models/FieldDef";
import {CSSField} from "../../models/fields/CSSField";

@Register
export class CSSRenderer extends PopulationOperator {

    private styleElement:HTMLElement;

    constructor() {
        super('CSSDescriptor');
        this.styleElement = document.getElementById('cssstyle');

    }

    execute(pop:Population):void {
        var ind = pop.individuals[0];
        this.styleElement.innerHTML = CSSField.getFullCSSString(ind.getValue('css'));

    }


    getFieldDefinition():Array<FieldDef> {
        return undefined;
    }


}