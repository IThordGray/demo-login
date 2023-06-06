import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from 'frontend/features/login';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthApi } from './auth.api';
import { AuthRealService } from './auth.real.service';
import { CONFIG } from './config.injection-token';

@NgModule({
  declarations: [ AppComponent ],
  imports: [ BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule ],
  providers: [
    AuthApi,
    { provide: CONFIG, useValue: environment },
    { provide: AuthService, useClass: AuthRealService },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
