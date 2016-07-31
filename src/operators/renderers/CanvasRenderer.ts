import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {FieldDef} from "../../models/FieldDef";

@Register
export class CanvasRenderer extends PopulationOperator {

    private canvas:any;
    private xfield:string;
    private yfield:string;
    private scale:any;

    private width:number = 400;
    private height:number = 300;

    constructor(xfield:string, yfield:string, scale?:any, canvasWidth?:number, canvasHeight?:number) {
        super("Canvas View");
        this.scale = scale;
        this.xfield = xfield;
        this.yfield = yfield;
        this.width = canvasWidth || this.width;
        this.height = canvasWidth || this.height;
        if (window) {
            this.canvas = $('<canvas style="border:1px solid #000;" width="' + this.width + 'px" height="' + this.height + 'px"></canvas>');
            var that = this;
            this.canvas.click(function(){
                var scaleX = that.scale && that.scale[that.xfield] !== undefined ? that.scale[that.xfield] : undefined;
                var scaleY = that.scale && that.scale[that.yfield] !== undefined ? that.scale[that.yfield] : undefined;



                scaleX[0]+=0.001;
                scaleX[1]-=0.001;
                scaleY[0]+=0.001;
                scaleY[1]-=0.001;
            });
            $(document.body).append(this.canvas);

        }


    }

    execute(population:Population):void {
        var canvas = this.canvas[0];


        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            //ctx.clearRect(0, 0, this.width, this.height);
            ctx.globalAlpha=0.2;
            ctx.fillStyle="white";
            ctx.fillRect(0, 0, this.width, this.height);

            ctx.globalAlpha = 1;
            ctx.fillStyle=population.color;
            var idx = 0;
            for (var ind of population.individuals) {
                idx++;

                var x = ind.getValue(this.xfield);
                var y = ind.getValue(this.yfield);

                var scaleX = this.scale && this.scale[this.xfield] !== undefined ? this.scale[this.xfield] : undefined;
                var scaleY = this.scale && this.scale[this.yfield] !== undefined ? this.scale[this.yfield] : undefined;

                if (scaleX) {
                    x = (Math.abs(x - scaleX[0]) / Math.abs(scaleX[1] - scaleX[0])) * this.width;

                }

                if (scaleY) {
                    y = (Math.abs(y - scaleY[0]) / Math.abs(scaleY[1] - scaleY[0])) * this.height;
                }


               // ctx.globalAlpha  = (1-idx/population.individuals.length);
               // ctx.fillStyle=population.color;

                ctx.fillRect(x, y, 1, 1);

            }
        }


    }

    getFieldDefinition():Array<FieldDef> {
        return undefined;
    }

}