
// import { Component, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { FinanceService } from '../../services/finance';

// @Component({
//   selector: 'app-expense-form',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './expense-form.html',
//   styleUrl: './expense-form.css',
// })
// export class ExpenseForm {
//   // 🟢 Public kar diya taaki HTML access kar sake
//   public financeService = inject(FinanceService);

//   description: string = '';
//   amount: number | null = null;
//   category: string = 'Food'; 
//   date: string = new Date().toISOString().split('T')[0];

//   // 💰 Expense add karne ka function
//   submitExpense() {
//     if (this.amount <= 0) {
//       alert("❌ Please enter a positive amount!");
//       return;
//     }
//     if (!this.description.trim()) {
//       alert("⚠️ Please add a description!");
//       return;
//     }

//     this.financeService.addExpanse(this.description, this.amount, this.category, this.date);
//     this.resetForm();
//   }

//   // 📝 Notepad item add karne ka function (Jo pehle dashboard mein tha)
//   addToNotepad(input: HTMLInputElement) {
//     const value = input.value.trim();
//     if (value) {
//       this.financeService.addNotepadItem(value);
//       input.value = ''; // Input clear
//     }
//   }

//   private resetForm() {
//     this.description = '';
//     this.amount = 0;
//     this.category = 'Food';
//     this.date = new Date().toISOString().split('T')[0];
//   }
// }

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../services/finance';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm {
  public financeService = inject(FinanceService);

  description: string = '';
  // 🟢 Isse starting mein input khali dikhega
  amount: number | null = null; 
  category: string = 'Food'; 
  date: string = new Date().toISOString().split('T')[0];

  submitExpense() {
    // 🟢 Amount null ya 0 check karne ke liye safe check
    if (this.amount === null || this.amount <= 0) {
      alert("❌ Please enter a positive amount!");
      return;
    }
    if (!this.description.trim()) {
      alert("⚠️ Please add a description!");
      return;
    }

    this.financeService.addExpanse(this.description, this.amount, this.category, this.date);
    this.resetForm();
  }

  addToNotepad(input: HTMLInputElement) {
    const value = input.value.trim();
    if (value) {
      this.financeService.addNotepadItem(value);
      input.value = ''; 
    }
  }

  private resetForm() {
    this.description = '';
    // 🟢 Reset ke baad 0 nahi, null set hoga taaki placeholder dikhe
    this.amount = null; 
    this.category = 'Food';
    this.date = new Date().toISOString().split('T')[0];
  }
}