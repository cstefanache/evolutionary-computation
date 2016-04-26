import {FieldDef} from "../FieldDef";
import {Num} from "../../Num";
export class StrField extends FieldDef {

    static possible:string = " ;:'\"!@#$%^&*()_+-=\\|,./<>?[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    length:number;

    constructor(name:string, min:number = 10, max:number = 100) {
        super(name);
        this.min = min;
        this.max = max;
    }


    getInitialValue():any {
        var text = "";
        for (var i = 0; i < Num.getRandomNum(this.min, this.max); i++)
            text += StrField.getRandomChar();

        return text;
    }

    static getRandomChar() {
        return StrField.possible.charAt(Math.floor(Math.random() * this.possible.length));
    }


}