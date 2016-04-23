export class Log {

    static error(...args:any[]):void {
        console.error(args);
    }

    static info(...args:any[]):void {
        console.log(args);
    }

}

