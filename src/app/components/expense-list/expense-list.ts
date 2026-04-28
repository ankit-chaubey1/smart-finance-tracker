import { Component, computed, inject, signal } from '@angular/core'; // 1. Added 'signal' to imports
import { FinanceService } from '../../services/finance';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-list',
  standalone: true, // Ensuring it's standalone
  imports: [CurrencyPipe, CommonModule, FormsModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  financeService = inject(FinanceService);
  expenses = this.financeService.filteredByMonth;
  totalSpent = this.financeService.totalSpent;

  // --- DASHBOARD STATS ---
  totalCount = computed(() => this.filteredExpenses().length);
  
  highestExpense = computed(() => {
    const list = this.filteredExpenses();
    return list.length ? Math.max(...list.map(e => e.amount)) : 0;
  });

  // --- SEARCH LOGIC ---
  searchQuery = signal('');

  filteredExpenses = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.expenses().filter(item => 
      item.description.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query)
    );
  });

  // --- EDITING STATE ---
  editingId = signal<any>(null);
  editDescription = '';
  editAmount = 0;
  editCategory = '';
  editDate = '';

  // --- HELPERS ---
  getCategoryEmoji(category: string): string {
    const emojis: { [key: string]: string } = {
      'Food': '🍔',
      'Rent': '🏠',
      'Fun': '🎉',
      'Bills': '⚡',
      'Travel': '🚗',
      'Clothes': '👕'
    };
    return emojis[category] || '💰';
  }

  // --- METHODS ---
  startEdit(item: any) {
    this.editingId.set(item.id);
    this.editDescription = item.description;
    this.editAmount = item.amount;
    this.editCategory = item.category || 'Food';
    this.editDate = item.date;
  }

  saveEdit(id: any) {
    this.financeService.updateExpense(id, this.editDescription, this.editAmount, this.editCategory, this.editDate);
    this.editingId.set(null); 
  }

  cancelEdit() { this.editingId.set(null); }

  deleteExpense(id: any) {
   const windowConfirm = confirm("⚠️ Are you sure? Kya aap sach mein ise delete karna chahte hain?");

  // 2. Agar user 'OK' dabaye tabhi delete karo
  if (windowConfirm) {
    this.financeService.deleteExpense(id);
  }
  }
}