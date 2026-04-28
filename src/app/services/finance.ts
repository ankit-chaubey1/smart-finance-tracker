
// import { computed, Injectable, signal, inject } from '@angular/core';
// import { Database, ref, push, onValue, remove, update } from '@angular/fire/database';
// import { Auth } from '@angular/fire/auth';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import confetti from 'canvas-confetti';

// export interface Expanse {
//   id?: string; 
//   description: string;
//   amount: number;
//   category: string;
//   date: string;
// }

// interface NoteItem {
//   task: string;
//   done: boolean;
//   date: string; 
//   isoDate: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class FinanceService {
//   private db = inject(Database);
//   private auth = inject(Auth);

//   private expansesSignal = signal<Expanse[]>([]);
//   expenses = this.expansesSignal.asReadonly();

//   selectedMonth = signal<string>(new Date().toISOString().substring(0, 7));
//   isDarkMode = signal<boolean>(localStorage.getItem('theme') === 'dark');

//   budgetLimit = signal<number>(Number(localStorage.getItem('user_budget_limit')) || 10000);
  
//   isOverBudget = computed(() => this.totalSpent() > this.budgetLimit());
  
//   budgetProgress = computed(() => {
//     const total = this.totalSpent();
//     const limit = this.budgetLimit();
//     if (limit <= 0) return 0;
//     const progress = (total / limit) * 100;
//     return progress > 100 ? 100 : progress;
//   });

//   // --- 🎉 CELEBRATION LOGIC ---
//   checkCelebration() {
//     const today = new Date();
//     const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
//     // Agar mahine ke aakhri 3 din hain aur budget bacha hai
//     if (today.getDate() >= lastDay - 2 && !this.isOverBudget() && this.totalSpent() > 0) {
//       this.launchConfetti();
//     }
//   }

//   launchConfetti() {
//     const end = Date.now() + 3 * 1000;
//     const colors = ['#007bff', '#28a745', '#ffc107'];

//     (function frame() {
//       confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
//       confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
//       if (Date.now() < end) requestAnimationFrame(frame);
//     }());
//   }

//   toggleDarkMode() {
//     const newMode = !this.isDarkMode();
//     this.isDarkMode.set(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//   }

//   updateBudgetLimit(newLimit: number) {
//     if (newLimit >= 0) {
//       this.budgetLimit.set(newLimit);
//       localStorage.setItem('user_budget_limit', newLimit.toString());
//     }
//   }

//   // --- 🎯 NOTEPAD LOGIC ---
//   private notepadSignal = signal<NoteItem[]>(JSON.parse(localStorage.getItem('quick_notes') || '[]'));

//   filteredNotes = computed(() => {
//     const month = this.selectedMonth();
//     return this.notepadSignal().filter(note => note.isoDate?.startsWith(month));
//   });

//   addNotepadItem(task: string) {
//     if(task.trim()) {
//       const now = new Date();
//       const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       const isoDate = now.toISOString().split('T')[0];
//       this.notepadSignal.update(items => {
//         const updated = [...items, { task, done: false, date: dateStr, isoDate }];
//         localStorage.setItem('quick_notes', JSON.stringify(updated));
//         return updated;
//       });
//     }
//   }

//   toggleNotepadItem(index: number) {
//     this.notepadSignal.update(items => {
//       const newItems = [...items];
//       newItems[index].done = !newItems[index].done;
//       localStorage.setItem('quick_notes', JSON.stringify(newItems));
//       return newItems;
//     });
//   }

//   deleteNotepadItem(index: number) {
//     this.notepadSignal.update(items => {
//       const updated = items.filter((_, i) => i !== index);
//       localStorage.setItem('quick_notes', JSON.stringify(updated));
//       return updated;
//     });
//   }

//   // --- 📊 EXPENSE LOGIC ---
//   filteredByMonth = computed(() => {
//     const month = this.selectedMonth();
//     return this.expansesSignal().filter(e => e.date.startsWith(month));
//   });

//   totalSpent = computed(() => this.filteredByMonth().reduce((acc, curr) => acc + curr.amount, 0));

//   async addExpanse(description: string, amount: number, category: string, date: string) {
//     const userId = this.auth.currentUser?.uid; 
//     if (userId) return push(ref(this.db, `expenses/${userId}`), { description, amount, category, date });
//     return null;
//   }

//   async updateExpense(id: any, description: string, amount: number, category: string, date: string) {
//     const userId = this.auth.currentUser?.uid;
//     if (userId) return update(ref(this.db, `expenses/${userId}/${id}`), { description, amount, category, date });
//     return null;
//   }

//   async deleteExpense(id: any) {
//     const userId = this.auth.currentUser?.uid;
//     if (userId) return remove(ref(this.db, `expenses/${userId}/${id}`));
//     return null;
//   }

//   exportPDF() {
//     const doc = new jsPDF();
//     const month = this.selectedMonth();
//     autoTable(doc, {
//       startY: 35,
//       head: [['Date', 'Description', 'Category', 'Amount']],
//       body: this.filteredByMonth().map(e => [e.date, e.description, e.category, `Rs. ${e.amount}`]),
//       headStyles: { fillColor: [40, 167, 69] }
//     });
//     doc.save(`Finance_Report_${month}.pdf`);
//   }

//   constructor() {
//     this.auth.onAuthStateChanged((user) => {
//       if (user) {
//         onValue(ref(this.db, `expenses/${user.uid}`), (snapshot) => {
//           const data = snapshot.val();
//           const list = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
//           this.expansesSignal.set(list);
//           this.checkCelebration(); // Celebration check on data load
//         });
//       }
//     });
//   }
// }
import { computed, Injectable, signal, inject } from '@angular/core';
import { Database, ref, push, onValue, remove, update } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as confetti from 'canvas-confetti'; // ✅ Foolproof import

export interface Expanse {
  id?: string; 
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface NoteItem {
  task: string;
  done: boolean;
  date: string; 
  isoDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private db = inject(Database);
  private auth = inject(Auth);

  private expansesSignal = signal<Expanse[]>([]);
  expenses = this.expansesSignal.asReadonly();

  selectedMonth = signal<string>(new Date().toISOString().substring(0, 7));
  isDarkMode = signal<boolean>(localStorage.getItem('theme') === 'dark');

  budgetLimit = signal<number>(Number(localStorage.getItem('user_budget_limit')) || 10000);
  
  isOverBudget = computed(() => this.totalSpent() > this.budgetLimit());
  
  budgetProgress = computed(() => {
    const total = this.totalSpent();
    const limit = this.budgetLimit();
    if (limit <= 0) return 0;
    const progress = (total / limit) * 100;
    return progress > 100 ? 100 : progress;
  });

  // --- 🎉 CELEBRATION LOGIC ---
  checkCelebration() {
    const today = new Date();
    // Mahine ka aakhri din nikalne ke liye
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    // Agar mahine ke aakhri 3 din hain aur budget bacha hai + koi kharcha kiya hai
    if (today.getDate() >= lastDay - 2 && !this.isOverBudget() && this.totalSpent() > 0) {
      this.launchConfetti();
    }
  }

  launchConfetti() {
    const end = Date.now() + 3 * 1000;
    const colors = ['#007bff', '#28a745', '#ffc107'];
    const myConfetti = (confetti as any).default || confetti; // Support for different build systems

    (function frame() {
      myConfetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      myConfetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }

  toggleDarkMode() {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  }

  updateBudgetLimit(newLimit: number) {
    if (newLimit >= 0) {
      this.budgetLimit.set(newLimit);
      localStorage.setItem('user_budget_limit', newLimit.toString());
    }
  }

  // --- 🎯 NOTEPAD LOGIC ---
  private notepadSignal = signal<NoteItem[]>(JSON.parse(localStorage.getItem('quick_notes') || '[]'));

  filteredNotes = computed(() => {
    const month = this.selectedMonth();
    return this.notepadSignal().filter(note => note.isoDate?.startsWith(month));
  });

  addNotepadItem(task: string) {
    if(task.trim()) {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isoDate = now.toISOString().split('T')[0];
      this.notepadSignal.update(items => {
        const updated = [...items, { task, done: false, date: dateStr, isoDate }];
        localStorage.setItem('quick_notes', JSON.stringify(updated));
        return updated;
      });
    }
  }

  toggleNotepadItem(index: number) {
    this.notepadSignal.update(items => {
      const newItems = [...items];
      newItems[index].done = !newItems[index].done;
      localStorage.setItem('quick_notes', JSON.stringify(newItems));
      return newItems;
    });
  }

  deleteNotepadItem(index: number) {
    this.notepadSignal.update(items => {
      const updated = items.filter((_, i) => i !== index);
      localStorage.setItem('quick_notes', JSON.stringify(updated));
      return updated;
    });
  }

  // --- 📊 EXPENSE LOGIC ---
  filteredByMonth = computed(() => {
    const month = this.selectedMonth();
    return this.expansesSignal().filter(e => e.date.startsWith(month));
  });

  totalSpent = computed(() => this.filteredByMonth().reduce((acc, curr) => acc + curr.amount, 0));

  // ✅ Chart ke liye ye zaroori hai (Error fix)
  categoryTotals = computed(() => {
    const totals: { [key: string]: number } = {};
    this.filteredByMonth().forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return totals;
  });

  async addExpanse(description: string, amount: number, category: string, date: string) {
    const userId = this.auth.currentUser?.uid; 
    if (userId) return push(ref(this.db, `expenses/${userId}`), { description, amount, category, date });
    return null;
  }

  async updateExpense(id: any, description: string, amount: number, category: string, date: string) {
    const userId = this.auth.currentUser?.uid;
    if (userId) return update(ref(this.db, `expenses/${userId}/${id}`), { description, amount, category, date });
    return null;
  }

  async deleteExpense(id: any) {
    const userId = this.auth.currentUser?.uid;
    if (userId) return remove(ref(this.db, `expenses/${userId}/${id}`));
    return null;
  }

  
  exportPDF(userName: string) { // Username pass karenge component se
  const doc = new jsPDF();
  const month = this.selectedMonth();
  const spent = this.totalSpent();
  const limit = this.budgetLimit();
  const diff = limit - spent;

  // --- 🟢 HEADER SECTION ---
  doc.setFontSize(18);
  doc.setTextColor(40, 167, 69); // Green color
  doc.text('Smart Finance Report', 14, 15);

  doc.setFontSize(12);
  doc.setTextColor(100);
  // Aapka message header mein
  doc.text(`Hello ${userName}, your monthly expense report for ${month}`, 14, 25);
  doc.text(`Total Spent: Rs. ${spent}`, 14, 32);

  // --- 📊 TABLE SECTION ---
  autoTable(doc, {
    startY: 38,
    head: [['Date', 'Description', 'Category', 'Amount']],
    body: this.filteredByMonth().map(e => [e.date, e.description, e.category, `Rs. ${e.amount}`]),
    theme: 'grid',
    headStyles: { fillColor: [40, 167, 69] }
  });

  // --- 🔴 FOOTER SECTION (Table ke baad) ---
 // --- 🔴 FOOTER SECTION FIXED ---
const finalY = (doc as any).lastAutoTable.finalY + 15;

doc.setFontSize(11);
doc.setFont("helvetica", "bold"); // Standard font set karein
doc.setTextColor(50);

const limitMsg = `Your budget limit was: Rs. ${limit}`;
doc.text(limitMsg, 14, finalY);

if (diff >= 0) {
    doc.setTextColor(40, 167, 69); // Success Green
    const saveMsg = `Great! You saved Rs. ${diff} this month. Keep it up!`;
    // CharSpace reset karne ke liye options object pass karein
    doc.text(saveMsg, 14, finalY + 8, { charSpace: 0 }); 
} else {
    doc.setTextColor(220, 53, 69); // Danger Red
    const alertMsg = `Alert: You spent Rs. ${Math.abs(diff)} more than your limit!`;
    // Isse spacing fix ho jayegi
    doc.text(alertMsg, 14, finalY + 8, { charSpace: 0 });
}

  // Download PDF
  doc.save(`Finance_Report_${month}.pdf`);
}

  constructor() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(this.db, `expenses/${user.uid}`), (snapshot) => {
          const data = snapshot.val();
          const list = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
          this.expansesSignal.set(list);
          this.checkCelebration(); // Load hote hi party check karo
        });
      }
    });
  }
}