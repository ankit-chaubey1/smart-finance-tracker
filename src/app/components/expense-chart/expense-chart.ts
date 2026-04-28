import { Component, ElementRef, ViewChild, inject, effect } from '@angular/core';
import { FinanceService } from '../../services/finance';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  template: `<canvas #expenseChart></canvas>`,
  styles: [`canvas { max-height: 300px; margin-top: 20px; }`]
})
export class ExpenseChartComponent {
  @ViewChild('expenseChart') chartCanvas!: ElementRef;
  private financeService = inject(FinanceService);
  chart: any;

  constructor() {
    // Ye effect tab chalega jab bhi expenses ka data badlega
    effect(() => {
      const data = this.financeService.categoryTotals();
      if (this.chart) {
        this.updateChart(data);
      } else if (this.chartCanvas) {
        this.createChart(data);
      }
    });
  }

  createChart(categoryData: any) {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut', // Ya 'bar' jo aapko pasand ho
      data: {
        labels: Object.keys(categoryData),
        datasets: [{
          data: Object.values(categoryData),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  updateChart(categoryData: any) {
    this.chart.data.labels = Object.keys(categoryData);
    this.chart.data.datasets[0].data = Object.values(categoryData);
    this.chart.update();
  }
}