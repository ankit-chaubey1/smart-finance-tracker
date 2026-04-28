

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Auth } from '@angular/fire/auth';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ExpenseForm } from '../expense-form/expense-form';
import { ExpenseList } from '../expense-list/expense-list';
import { ExpenseChartComponent } from '../expense-chart/expense-chart';
import { FinanceService } from '../../services/finance';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ExpenseForm, ExpenseList, ExpenseChartComponent],
  animations: [
    trigger('staggerAnim', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger('100ms', [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div [style.background]="financeService.isDarkMode() ? '#121212' : '#f0f2f5'" 
         [style.color]="financeService.isDarkMode() ? '#e0e0e0' : '#333'"
         style="min-height: 100vh; transition: all 0.3s ease; padding: 20px 0; font-family: 'Segoe UI', Roboto, sans-serif;">
      
      <div style="width: 95%; max-width: 1400px; margin: 0 auto;">
        
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 0 10px;">
          <div>
            <h2 style="margin: 0; font-weight: 600;">Hello Dear, <span style="color: #007bff;">{{ userName() }}</span>! 👋</h2>
            <p style="margin: 5px 0 0; opacity: 0.7; font-size: 0.9rem;">Manage your finances with ease</p>
          </div>
          <button (click)="financeService.toggleDarkMode()" 
                  style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,123,255,0.2);">
            {{ financeService.isDarkMode() ? '☀️ Light Mode' : '🌙 Dark Mode' }}
          </button>
        </header>

        <div class="dashboard-grid">
          <div class="grid-col side-col">
            <div class="card" [style.background]="financeService.isDarkMode() ? '#1e1e1e' : 'white'">
              <h4 style="margin-top: 0;">💰 Budget Overview</h4>
              <div style="display: flex; flex-direction: column; gap: 15px;">
                <input type="number" [ngModel]="financeService.budgetLimit()" (ngModelChange)="financeService.updateBudgetLimit($event)" class="custom-input" [style.background]="financeService.isDarkMode() ? '#2c2c2c' : '#f8f9fa'">
                <div style="width: 100%; background: #444; border-radius: 10px; height: 12px; overflow: hidden;">
                  <div [style.width.%]="financeService.budgetProgress()" [style.background]="financeService.isOverBudget() ? '#ff5252' : '#4caf50'" style="height: 100%; transition: 0.5s;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 0.85rem;">
                   <span>Spent: {{ financeService.budgetProgress().toFixed(1) }}%</span>
                   <span [style.color]="financeService.isOverBudget() ? '#ff5252' : '#4caf50'">{{ financeService.totalSpent() }} / {{ financeService.budgetLimit() }}</span>
                </div>
              </div>
            </div>

            <div class="card market-card" [style.background]="financeService.isDarkMode() ? '#2d2d00' : '#fff9c4'">
              <h4 style="margin: 0 0 15px 0; color: #856404;">📝 Market Notes</h4>
              <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                <input #noteInput type="text" placeholder="Add quickly..." (keyup.enter)="addToNotepad(noteInput)" class="custom-input" style="flex: 1; border-color: #fbc02d;">
                <button (click)="addToNotepad(noteInput)" class="btn-primary" style="background: #fbc02d; color: #333;">Add</button>
              </div>
              <ul class="note-list">
                @for (item of financeService.filteredNotes(); track $index) {
                  <li>
                    <input type="checkbox" [checked]="item.done" (change)="financeService.toggleNotepadItem($index)">
                    <span [style.text-decoration]="item.done ? 'line-through' : 'none'">{{ item.task }}</span>
                    <button (click)="financeService.deleteNotepadItem($index)" class="btn-delete">❌</button>
                  </li>
                }
              </ul>
            </div>
            
            <div class="card" [style.background]="financeService.isDarkMode() ? '#1e1e1e' : 'white'">
               <h4 style="margin-top: 0;">📅 Reports</h4>
               <input type="month" [ngModel]="financeService.selectedMonth()" (ngModelChange)="financeService.selectedMonth.set($event)" class="custom-input" style="width: 100%; margin-bottom: 15px;">
               <button (click)="financeService.exportPDF(this.userName())" class="btn-primary" style="width: 100%; background: #dc3545;">Download PDF</button>
            </div>
          </div>

          <div class="grid-col main-col" [@staggerAnim]="financeService.expenses().length">
            <div class="card" [style.background]="financeService.isDarkMode() ? '#1e1e1e' : 'white'">
              <app-expense-form></app-expense-form>
            </div>
            <div class="card" [style.background]="financeService.isDarkMode() ? '#1e1e1e' : 'white'">
              <app-expense-list></app-expense-list>
            </div>
            <div class="card" [style.background]="financeService.isDarkMode() ? '#1e1e1e' : 'white'">
              <h3 style="text-align: center; margin-bottom: 20px;">Expense Distribution</h3>
              <div style="max-width: 400px; margin: 0 auto;"><app-expense-chart></app-expense-chart></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .dashboard-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 25px; align-items: start; }
      .card { padding: 20px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); margin-bottom: 25px; transition: all 0.3s ease; border: 1px solid rgba(0,0,0,0.05); }
      .card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
      .custom-input { padding: 10px; border-radius: 10px; border: 1px solid #ddd; outline: none; }
      .btn-primary { border: none; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: bold; color: white; transition: opacity 0.2s; }
      .btn-primary:active { transform: scale(0.98); }
      .note-list { list-style: none; padding: 0; max-height: 200px; overflow-y: auto; }
      .note-list li { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px dashed rgba(0,0,0,0.1); }
      .btn-delete { background: none; border: none; cursor: pointer; }
      @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }
    </style>
  `
})
export class Dashboard {
  financeService = inject(FinanceService);
  private auth = inject(Auth);
  userName = signal<string>('Guest');

  constructor() {
    this.auth.onAuthStateChanged((user: any) => {
      if (user) {
        const name = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User';
        this.userName.set(name);
      }
    });
  }

  addToNotepad(input: HTMLInputElement) {
    const value = input.value.trim();
    if (value) {
      this.financeService.addNotepadItem(value);
      input.value = '';
    }
  }
}