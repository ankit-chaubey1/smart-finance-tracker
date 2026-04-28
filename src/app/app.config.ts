

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideAnimations } from '@angular/platform-browser/animations';

const firebaseConfig = {
  apiKey: "AIzaSyAMzjAUKCMdke8cmuN2qjkdTnbJ_Zob5t4",
  authDomain: "financetracker-aed61.firebaseapp.com",
  projectId: "financetracker-aed61",
  storageBucket: "financetracker-aed61.firebasestorage.app",
  messagingSenderId: "916135072764",
  appId: "1:916135072764:web:847c1dbeebe9f36b701879",
  measurementId: "G-DQFXJGE2PG"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => {
      const auth = getAuth();
      // Ye line session ko permanent bana degi
      setPersistence(auth, browserLocalPersistence);
      return auth;
    }),
    provideDatabase(() => getDatabase())
  ]
};