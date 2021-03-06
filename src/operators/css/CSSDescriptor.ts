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
export class CSSDescriptor extends IndividualOperator {

    private styleElement:HTMLStyleElement;
    private htmlElement:HTMLElement;
    private elementId:string;

    constructor(id:string) {
        super('CSSDescriptor');
        this.elementId = id;
        this.styleElement = document.createElement('style');
        this.styleElement.id = "cssstyle";
        document.getElementsByTagName('head')[0].appendChild(this.styleElement);
        this.htmlElement = document.getElementById(id);

    }

    execute(ind:Individual):void {
        if (ind.getValue('result') === undefined) {
            var val = CSSField.getFullCSSString(ind.getValue('css'));
            this.styleElement.innerHTML = val;
            var value = 0;

            value += this.alignment(document, '.content > div', true);
            value += this.noOverlapping(document, '.content > div');
            value += this.noOffset(document, '.content > div');
            value += this.fitInsideParent(document.getElementsByClassName('content')[0]);

            [].slice.call(document.querySelectorAll('.content > div')).forEach(elem=> {
                value += this.alignment(elem, '.elem', false);
                value += this.noOverlapping(elem, '.elem');
            });

            if (val.length === 0) {
                value = 1e10;
            } else {
                value += 1 - 1 / val.length;
            }


            ind.setValue("result", value);
        }
    }

    noOffset(root:any, query:String, increment:number = 0.1):number {
        var value = 0;
        [].slice.call(root.querySelectorAll(query)).forEach(elem=> {
            value += Math.abs(elem.offsetLeft);
        });

        return value;
    }


    fitInsideParent(element:any):number {
        var value = 0;

        var parent = element.parentElement,
            width = parent.offsetWidth,
            height = parent.offsetHeight,
            actualWidth = element.offsetWidth + element.offsetLeft,
            actualHeight = element.offsetHeight + element.offsetTop;


        value += actualWidth > width ? actualWidth - width : 0;
        value += actualHeight > height ? actualHeight - height : 0;

        if (value > 0) {
            value = 1 - (1 / value);
        }

        return value;
    }

    noOverlapping(root:any, query:String, increment:number = 0.1):number {
        var value = 0,
            arr = [].slice.call(root.querySelectorAll(query));
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                var rect1 = arr[i].getBoundingClientRect();
                var rect2 = arr[j].getBoundingClientRect();
                var overlap = !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom)

                if (overlap) {
                    value += increment;
                }
            }
        }

        return value;
    }

    alignment(root:any, query:String, leftAlignment:boolean, increment:number = 0.1):number {
        var value = 0;
        var lastX = -1;
        var lastY = -1;

        [].slice.call(root.querySelectorAll(query)).forEach(elem=> {
            var clientRect = elem.getBoundingClientRect();

            if (lastX == -1 && lastY == -1) {

            } else if (!leftAlignment && lastY !== clientRect.top) {
                value += Math.abs(clientRect.top - lastY);
            } else if (leftAlignment && lastX !== clientRect.left) {
                value += Math.abs(clientRect.left - lastX);
            }

            lastX = clientRect.left;
            lastY = clientRect.top;

        });

        return value;
    }

    getFieldDefinition():Array<FieldDef> {
        var css = new CSSField(this.elementId, 'css');
        var value = new OutputField("result");
        return [css, value];
    }


}