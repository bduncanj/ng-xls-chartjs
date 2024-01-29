export interface ChartData {
  title: String;
  datasets: Dataset[]
  labels: string[];
  chartType: 'line' | 'bar'
}

export interface Dataset {
  label: string;
  data: any[];
}

export interface WorkbookErrors {
  [key: string]: string
}
