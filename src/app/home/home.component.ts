import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSourceService } from '../datasource.service';
import { ChartComponent } from '../chart/chart.component'
import { ChartData } from '../types';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  template: `
   <section>
    <form>
      <label for="fileUpload">Choose XLSX data file:</label>
      <input type="file" accept=".xlsx, .xls" (change)="onFileUpload($event)" #fileUpload>
      <button class="primary" type="button" (click)="onClickPlot()">Plot</button>
    </form>
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
  // File object selected by the user
  file: File | null;
  // Chart data ready to be rended by chart objects
  chartData: ChartData[] | null;

  constructor() {
    this.file = null;
    this.chartData = null;
  }

  onFileUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files?.length) {
      alert('Please select a single file');
      return;
    }

    this.file = files[0];
    this.onClickPlot();
  }

  async onClickPlot() {
    this.chartData = [];
    if (this.file instanceof File) {
      this.chartData = await this.dataSource.getChartData(this.file);
    }
  }

}
