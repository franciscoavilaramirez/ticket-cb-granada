import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { DivisorComponent } from '../../../componentes/divisor/divisor.component';
import { NavbarComponent } from '../../../componentes/navbar/navbar.component';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { AdminHomeComponent } from './admin-home.component';
import { AdminHomeRoutingModule } from './admin-home-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AdminHomeComponent ],
  imports: [

    FilterPipe,
    NavbarComponent,
    DivisorComponent,
    CommonModule,
    AdminHomeRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule
  ],
  providers:[]
})
export class AdminHomeModule { }
