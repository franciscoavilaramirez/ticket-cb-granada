import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { PerfilComponent } from './perfil.component';
import { PerfilRoutingModule } from './perfil-routing.module';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [ PerfilComponent ],
  imports: [
    NavbarComponent,
    CommonModule,
    PerfilRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  providers:[]
})
export class PerfilModule { }
