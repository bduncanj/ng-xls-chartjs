import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartData } from '../types'

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  template: `
    <h2>{{data.title}}</h2>
    <div class="chart-container">
      <canvas #chart>{{chart}}</canvas>
    </div>
  `,
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  @Input() data!: ChartData;
  @ViewChild('chart') chartContainer!: ElementRef;

  chart: Chart | null = null;

  constructor() {
  }

  ngAfterViewInit() {
    this.buildChart();
  }

  /**
   * Render a Chart object based on the passed in data
   */
  buildChart() {
    this.chart = new Chart(this.chartContainer?.nativeElement, {
      type: this.data.chartType,
      data: {
        labels: this.data.labels,
        datasets: this.data.datasets
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
