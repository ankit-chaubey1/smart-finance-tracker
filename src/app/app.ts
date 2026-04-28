import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpenseForm } from './components/expense-form/expense-form';
import { ExpenseList } from './components/expense-list/expense-list';
import { ExpenseChartComponent } from './components/expense-chart/expense-chart';
import { Dashboard } from './components/dashboard/dashboard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('smart-finance');
}
