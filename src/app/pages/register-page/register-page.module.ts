import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from '../../app-routing.module';
import { ErrorAlertFormComponent } from '../../componentes/error-alert-form/error-alert-form.component';
import { RegisterPageComponent } from './register-page.component';
import { RegisterPageRoutingModule } from './register-page-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EmailConfirmacionModule } from '../email-confirmacion/email-confirmacion.module';

@NgModule({
  declarations: [ RegisterPageComponent ],
  imports: [
    CommonModule,
    RegisterPageRoutingModule,
    ErrorAlertFormComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule,
    EmailConfirmacionModule
  ],
  providers:[]
})
export class RegisterPageModule { }
