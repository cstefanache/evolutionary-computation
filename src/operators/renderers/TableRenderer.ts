import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {FieldDef} from "../../models/FieldDef";

@Register
export class TableRenderer extends PopulationOperator {

    private tableElement:JQuery;
    private maxRows:number;

    constructor(maxRows?:number, private cols?:Array<string>) {
        super("Table View");
        this.maxRows = maxRows;
        if (window) {

            this.tableElement = $('<table class="table table-striped"></table>');
            $(document.body).append(this.tableElement);
        }
    }

    execute(population:Population):void {

        if (population.index === 0) {
            var htmlContent = '<thead><tr><th>&nbsp</th>';

            for (var field of this.cols ? this.cols : population.fields) {
                htmlContent += '</th><th>' + field + '</th>';
            }

            htmlContent += "</tr></thead><tbody>";
        }
        var index = 0;
        for (var ind of population.individuals) {
            if (this.maxRows !== undefined && index++ > this.maxRows)
                break;

            htmlContent += '<tr><td style="background-color:' + population.color + '">&nbsp;</td>';
            for (var field of this.cols ? this.cols : population.fields) {
                htmlContent += '<td>' + JSON.stringify(ind.getValue(field)) + '</td>';
            }
            htmlContent += '</tr>';
        }

        htmlContent += '</tbody>';

        if (population.index === 0) {
            this.tableElement.html(htmlContent);
        } else {
            this.tableElement.find('tbody').append(htmlContent);
        }

    }

    getFieldDefinition():Array<FieldDef> {
        return undefined;
    }

}