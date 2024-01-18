import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon'
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';


import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './componentes/home/home.component';
import { UpdateUserComponent } from './componentes/update-user/update-user.component';

import { ArchivosPDFComponent } from './componentes/archivos-pdf/archivos-pdf.component';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { RegisterPageComponent } from '../pages/register-page/register-page.component';
import { ErrorAlertFormComponent } from './componentes/error-alert-form/error-alert-form.component'



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UpdateUserComponent,
    ArchivosPDFComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ErrorAlertFormComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    MatListModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
