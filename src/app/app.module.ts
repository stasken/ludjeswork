import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [DatePipe, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"ludjeworks","appId":"1:729179731913:web:b715c4ba53b7c4cf3bda18","storageBucket":"ludjeworks.appspot.com","apiKey":"AIzaSyDz-x0HdvMEMEFXaIa7anSHYt-iqaBaBjs","authDomain":"ludjeworks.firebaseapp.com","messagingSenderId":"729179731913","measurementId":"G-XWRY2JNM71"})), provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule {}
