# ng-xls-chartjs

## About

NodeJS application to render data arranged in sheets in XLS file as line or bar chart using ChartJS

## Usage

**Important** Use `npm install --legacy-peer-deps` to avoid peer dependency issue with NPM >= 7.

`ng serve -o` - Starts the user interface in your browser.

1. Browse and upload a sample data file (i.e. `./data/sample.xlsx`)
1. Click `Plot` button to render graphs

## Data format

Will render data from `XLSX` workbooks with sheets named `CamelPrefix_LineChart` or `CamelPrefix_BarChart`, other tabs will be ignored.

## Sample data

* `./data/sample.xlsx` - Two sheets correctly formatted, will not return errors.
* `./data/sample_corrupt.xlsx` - Several correct sheets, corrupt sheets as follows: 
  * Incorrect `hoursEndings` X column label (suffix `s` added)
  * Missing Y data columns
  * Incorrect sheet suffix (`_linchart`)
