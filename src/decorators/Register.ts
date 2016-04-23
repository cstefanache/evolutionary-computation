function Register(constructor:Function) {

    if (window && window['ops'] === undefined) {
        window['ops'] = {}
    }
    var name = /function ([^(]*)/.exec(constructor + "")[1];
    window['ops'][name] = {
        name: name,
        func: constructor
    };

}



