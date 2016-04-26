import {FieldDef} from "../FieldDef";
import {Num} from "../../Num";
import {StrField} from "./StrField";
export class JSCodeField extends FieldDef {

    private keywords:Array<string> = ["abstract", "arguments", "boolean", "break", "byte", "case", "catch", "char", "class*", "const", "continue",
        "debugger", "default", "delete", "do", "double", "else", "enum*", "eval",
        "export*", "extends*", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import*",
        "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private",
        "protected", "public", "return", "short", "static", "super*", "switch", "synchronized", "this", "throw", "throws", "transient",
        "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"];
    private possible:string = " ;:'\"!@#$%^&*()_+-=\\|,./<>?[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private assignment:Array<string> = ["+", "-", "*", "/", "%", "++", "--", "=", "=", "+=", "-=", "*=", "/=", "%="];

    blocks:number;

    constructor(name:string, min:number = 10, max:number = 100) {
        super(name, "");
        this.min = min;
        this.max = max;

    }

    getInitialValue():any {
        this.blocks = Num.getRandomNum(this.min, this.max);
        var result = "";
        while (this.blocks > 0) {
            result += this.getBlock();
        }

        return result;
    }

    getBlock():string {
        var value = "";
        this.blocks--;
        if (this.blocks < 0)
            return value;

        var rand = Num.randomInt(0, 3);

        var str = this['case' + rand]();
        value += str;

        return value;

    }


    //assignment
    case0():string {
        return this.getBlock() + this.assignment[Num.randomInt(0, this.assignment.length)] + this.getBlock();
    }

    //random
    case1():string {
        var num = Num.randomInt(1, 10);
        var str = "";

        for (var i = 0; i < num; i++) {
            str += StrField.getRandomChar();

        }

        return str;
    }

    //data-structure
    case2():string {
        var wrapperRand = Num.randomInt(0, 2);
        return wrapperRand === 0 ?
        '[' + this.getBlock() + ']' :
            wrapperRand === 1 ?
            '{' + this.getBlock() + '}' :
                wrapperRand === 2 ?
                '(' + this.getBlock() + ')' :
                '"' + this.getBlock() + '"';
    }

    //data-structure
    case3():string {
        return " " + this.keywords[Num.randomInt(0, this.keywords.length - 1)] + " ";
    }


}