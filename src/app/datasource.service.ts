import { Injectable } from '@angular/core';
import { ChartData, Dataset, WorkbookErrors } from './types'
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
  public async getChartData(file: File): Promise<{ charts: ChartData[], errors: WorkbookErrors }> {
    return new Promise((res, rej) => {
      let chartData: ChartData[] = [];
      let errors: { [key: string]: string } = {};

      let reader = new FileReader();
      reader.onload = () => {
        const workbook = XLSX.read(reader.result, { type: "binary" });

        // Validate and transform datasets of each sheet
        for (let [name, sheet] of Object.entries(workbook.Sheets)) {

          let found = name.match(/^(.*?)_(Bar|Line)Chart$/i);
          if (!found) {
            errors[name] = 'Sheet name does not end in _LineChart or _BarChart';
            continue;
          }
          // Create human readable title from sheet prefix
          let title = found[1].split(/(?=[A-Z])/).join(' ');
          let chartType = found[2].toLowerCase();

          const data = <{ [key: string]: number }[]>XLSX.utils.sheet_to_json(sheet);

          if (!data[0][this.xAxisLabel]) {
            errors[name] = `X axis label data column (${this.xAxisLabel}) does not exist`;
            continue;
          }

          if (Object.keys(data[0]).length <= 1) {
            errors[name] = 'Insufficient data columns exist (expect at least 1 Y column)'
            continue;
          }

          chartData.push({
            title,
            labels: data.map(r => String(r[this.xAxisLabel])),
            datasets: this.rowsToDataSets(data),
            chartType: <'line' | 'bar'>chartType
          });

        }
        res({ charts: chartData, errors });
      }
      reader.readAsBinaryString(file);
    });
  }

}
