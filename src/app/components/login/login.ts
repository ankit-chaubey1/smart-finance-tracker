import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 Ye dono imports zaroori hain form ke liye
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  // Form inputs ke liye variables
  email = '';
  password = '';
  
  // Login ya Signup toggle karne ke liye
  isLoginMode = signal(true); 
  errorMessage = signal('');

  async handleAuth() {
    try {
      this.errorMessage.set(''); // Purana error saaf karo
      
      if (this.isLoginMode()) {
        // Login Logic
        await signInWithEmailAndPassword(this.auth, this.email, this.password);
        console.log('Login Successful!');
      } else {
        // Signup Logic
        await createUserWithEmailAndPassword(this.auth, this.email, this.password);
        console.log('Account Created!');
      }
      
      // Success hone par dashboard par bhejo
      this.router.navigate(['/dashboard']); 

    } catch (err: any) {
      // Agar error aaye (jaise galat password) toh user ko dikhao
      this.errorMessage.set(err.message);
    }
  }

  toggleMode() {
    this.isLoginMode.update(val => !val);
  }
}