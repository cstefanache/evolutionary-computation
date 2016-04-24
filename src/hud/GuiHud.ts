import {Application} from "../Application";
export class GuiHud {

    app:Application;

    constructor(app:Application) {

        if (!window) {
            throw new Error("Window object is missing. Not in a browser environment?");
        }

        this.app = app;
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(
            ".cm-btn {" +
            "   background-color: #FFFFFF; " +
            "   border-radius: 2px; " +
            "   padding: 6px; " +
            "   margin: 2px;" +
            "   box-shadow: 0px 0px 1px rgba(0,0,0,125);" +
            "   -webkit-touch-callout: none; " +
            "   -webkit-user-select: none;   " +
            "   -khtml-user-select: none;    " +
            "   -moz-user-select: none;      " +
            "   -ms-user-select: none;       " +
            "   user-select: none;           " +

            "}" +
            ".cm-btn:hover {" +
            "   background-color: #FFFFFF; " +
            "   cursor:pointer; " +
            "   margin: 0px;" +
            "   padding: 8px;" +
            "   box-shadow: 0px 0px 6px rgba(0,0,0,125);" +
            "}" +
            ""));


        document.head.appendChild(style);

        var root:HTMLElement = window.document.createElement('div');
        root.style.position = "fixed";
        root.style.backgroundColor = "rgba(0,0,0,0.2)";
        root.style.padding = "10px";
        root.style.right = "20px";
        root.style.bottom = "20px";


        this.addButton(root, "Start", function () {
            app.start()
        });

        this.addButton(root, "Tick", function () {
            app.tick()
        });

        this.addButton(root, "Stop", function () {
            app.stop()
        });

        var populationNumber:HTMLInputElement = window.document.createElement('input');
        populationNumber.value = "100";
        populationNumber.style.width = "50px";

        var addPop:HTMLElement = this.addButton(root, "+ Population", function () {
            app.addPopulation(parseInt(populationNumber.value));
        });

        addPop.appendChild(populationNumber);

        this.addButton(root, "Reset", function () {
            app.resetPopulations();
            app.addPopulation(parseInt(populationNumber.value));
        });

        window.document.body.appendChild(root);

    }

    private addButton(root:HTMLElement, name:string, callback:Function):HTMLElement {
        var button:HTMLElement = window.document.createElement('span');
        button.innerHTML = name;
        button.className = "cm-btn";
        button.addEventListener('click', function () {
            callback();
        });

        root.appendChild(button);
        return button;
    }

}