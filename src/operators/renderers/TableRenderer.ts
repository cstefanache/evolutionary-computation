import {PopulationOperator} from "../../models/PopulationOperator";
import {Population} from "../../models/Population";
import {FieldDef} from "../../models/FieldDef";

@Register
export class TableRenderer extends PopulationOperator {

    private tableElement:JQuery;
    private maxRows:number;

    constructor(maxRows:number) {
        super("Table View");
        this.maxRows = maxRows;
        if (window) {

            this.tableElement = $('<table class="table table-striped"></table>');
            $(document.body).append(this.tableElement);
        }
    }

    execute(population:Population):void {
        var htmlContent = '<thead><tr>';

        for (var field of population.fields) {
            htmlContent += '<th>' + field + '</th>';
        }

        htmlContent += "</tr></thead><tbody>";
        var index = 0;
        for (var ind of population.individuals) {
            if (this.maxRows !== undefined && index++ > this.maxRows)
                break;

            htmlContent += '<tr>';
            for (var field of population.fields) {
                htmlContent += '<td>' + JSON.stringify(ind.getValue(field)) + '</td>';
            }
            htmlContent += '</tr>';
        }

        htmlContent += '</tbody>';

        this.tableElement.html(htmlContent);

    }

    getFieldDefinition():Array<FieldDef> {
        return undefined;
    }

}