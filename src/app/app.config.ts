

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';


import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideAnimations } from '@angular/platform-browser/animations';

const firebaseConfig = {
  apiKey: "Your_key",
  authDomain: "financetracker-aed61.firebaseapp.com",
  projectId: "financetracker-aed61",
  storageBucket: "yours",
  messagingSenderId: "yours",
  appId: "yours",
  measurementId: "yours"
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
