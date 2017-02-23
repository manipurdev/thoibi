import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';

enableProdMode();

const firebaseConfig = {
  apiKey: "AIzaSyBhg6wpEhmXL_tCaRHfLeEFEwHmhLDXLF8",
  authDomain: "people-82905.firebaseapp.com",
  databaseURL: "https://people-82905.firebaseio.com",
  storageBucket: "people-82905.appspot.com",
  messagingSenderId: "96247822155"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
