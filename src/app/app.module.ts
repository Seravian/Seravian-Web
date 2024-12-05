import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { LoginsignupComponent } from './component/auth/login-sign-up/login-sign-up.component';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({"projectId":"seravian","appId":"1:51931785705:web:34b4efd31d47cacfdac378","storageBucket":"seravian.firebasestorage.app","apiKey":"AIzaSyDd1DKc_CE2-1DKYKkr3nrRGaE_tV19dZ0","authDomain":"seravian.firebaseapp.com","messagingSenderId":"51931785705","measurementId":"G-ZJCYTY6YGD"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
