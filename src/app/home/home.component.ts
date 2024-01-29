import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSourceService } from '../datasource.service';
import { ChartComponent } from '../chart/chart.component'
import { ChartData, WorkbookErrors } from '../types';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  template: `
   <section>
    <form>
      <label for="fileUpload">Choose XLSX data file:</label>
      <input type="file" accept=".xlsx, .xls" (change)="onFileSelect($event)" #fileUpload>
    </form>
    <section *ngIf="hasErrors()" class="errors">
    Errors exist:
      <ul><li *ngFor="let error of errors | keyvalue">[Sheet: {{error.key}}] {{error.value}}</li></ul>
    </section>
    <section class="results">
      <app-chart *ngFor="let data of chartData" [data]="data"></app-chart>
    </section>
  </section>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Validate and transform provided data
  dataSource: DataSourceService = inject(DataSourceService);

  // Chart data ready to be rended by chart objects
  chartData!: ChartData[];

  errors!: WorkbookErrors;

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  constructor() {
  }

  async onFileSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) {
      alert('Please select a single file');
      return;
    }

    this.chartData = [];
    if (files[0] instanceof File) {
      let { charts, errors } = await this.dataSource.getChartData(files[0]);
      this.chartData = charts;
      this.errors = errors;
    }
  }

}
