import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { DivisorComponent } from '../../componentes/divisor/divisor.component';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    NavbarComponent,
    DivisorComponent,
    CommonModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatButtonModule,
    HomeRoutingModule,
    MatInputModule
  ],
  providers:[]
})
export class HomeModule { }
