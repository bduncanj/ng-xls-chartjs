import { Injectable } from '@angular/core';
import { ChartData, Dataset } from './types'
import * as XLSX from 'xlsx'

@Injectable({
  providedIn: 'root'
})
/**
 * @class DataSourceService
 * @description Supports the validation, loading and transformation of XLS data source into
 * content which can be consumed by SheetsJS rendering plugin.
 */
export class DataSourceService {

  constructor() { }

  readonly xAxisLabel = 'hourEnding';

  /**
   * Convert XLS JSON data (rows and columns) to array of type Dataset which can
   * be natively consumed by SheetsJS
   * @param rows
   * @returns
   */
  private rowsToDataSets(rows: any[]): Dataset[] {
    let datasets: { [key: string]: number[] } = {};

    // TODO: move this to the type definition of the row
    for (let row of rows as { [key: string]: number }[]) {
      for (let [colName, colValue] of Object.entries(row)) {
        if (colName == this.xAxisLabel) {
          continue;
        }
        if (!datasets[colName]) {
          datasets[colName] = [];
        }
        datasets[colName].push(colValue);
      }
    }

    return Object.entries(datasets).map(([label, data]) => { return { label, data } })
  }

  /**
   * Convert the passed file into chart objects that can be graphed
   * @param File
   */
  public async getChartData(file: File): Promise<ChartData[]> {
    return new Promise((res, rej) => {
      let fileData: ChartData[] = [];

      let reader = new FileReader();
      reader.onload = () => {
        const workbook = XLSX.read(reader.result, { type: "binary" });

        // Pre-create the RegEx instead of building on each loop
        const chartTypes = {
          bar: /^(.*?)_BarChart$/i,
          line: /^(.*?)_LineChart$/i
        }

        // Validate and transform datasets of each sheet
        for (let [name, sheet] of Object.entries(workbook.Sheets)) {

          // Ensure sheet name matches convention
          for (let [chartType, sheetRegEx] of Object.entries(chartTypes)) {
            let found = name.match(sheetRegEx);
            if (!found) {
              continue;
            }
            // Create human readable title from sheet prefix
            let title = found[1].split(/(?=[A-Z])/).join(' ');
            const data = <{ [key: string]: number }[]>XLSX.utils.sheet_to_json(sheet);

            fileData.push({
              title,
              labels: data.map(r => String(r[this.xAxisLabel])),
              datasets: this.rowsToDataSets(data),
              chartType: <'line' | 'bar'>chartType
            });
          }
        }
        res(fileData);
      }
      reader.readAsBinaryString(file);
    });
  }

}
