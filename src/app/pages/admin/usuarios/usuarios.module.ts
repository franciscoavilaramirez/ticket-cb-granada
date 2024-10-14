import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from '../../../componentes/navbar/navbar.component';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [ UsuariosComponent ],
  imports: [
    NavbarComponent,
    FilterPipe,
    CommonModule,
    UsuariosRoutingModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    TranslateModule,
    MatInputModule
  ],
  providers:[]
})
export class UsuariosModule { }
