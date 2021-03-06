export class Num {

    static getRandomNum(min:number = 0, max:number = 1, precision?:number):number {
        var result:number = min + (Math.random() * (max - min));

        if (precision !== undefined) {
            var power = Math.pow(10, precision);
            result = Math.round(result * power) / power;
        }


        return result;
    }

    static randomInt(min:number = 0, max:number = 1) {
        return Num.getRandomNum(min, max, 0);
    }

    static randomArrPicker(arr:Array<any>):any {
        return arr[Math.round(Math.random() * (arr.length - 1))];
    }

    static roundToPrecision(value:number, precision:number):number {
        var pow = Math.pow(10, 6);
        var val = Math.round(value * pow) / pow;

        return val;
    }

}

