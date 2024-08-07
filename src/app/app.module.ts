import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon'
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';


import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UpdateUserComponent } from './componentes/update-user/update-user.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';

import { ArchivosPDFComponent } from './componentes/archivos-pdf/archivos-pdf.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ErrorAlertFormComponent } from './componentes/error-alert-form/error-alert-form.component'
import { AddUserComponent } from './componentes/add-user/add-user.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component'
import { SubirEntradasComponent } from './pages/admin/subir-entradas/subir-entradas.component'
import { HomeComponent } from './pages/home/home.component';
import { DivisorComponent } from './componentes/divisor/divisor.component';
import { EditPasswordComponent } from './componentes/edit-password/edit-password.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

import localeEs from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common';
import { NavbarComponent } from './componentes/navbar/navbar.component'
registerLocaleData(localeEs, 'es');
import { CommonModule } from '@angular/common';
import { ModifyMatchComponent } from './componentes/modify-match/modify-match.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslationComponent } from './translation/translation.component';
import { UsuariosComponent } from './pages/admin/usuarios/usuarios.component';
import { RegisterAdminDialogComponent } from './componentes/register-admin-dialog/register-admin-dialog.component';
import { ListUserComponent } from './componentes/list-user/list-user.component';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import { FilterPipe } from './pipes/filter.pipe';
import { HabilitarEntradasComponent } from './pages/admin/habilitar-entradas/habilitar-entradas.component';
import { AddEntradasUsuarioComponent } from './componentes/add-entradas-usuario/add-entradas-usuario.component';
import { MatchAssistUserComponent } from './componentes/match-assist-user/match-assist-user.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UpdateUserComponent,
    ArchivosPDFComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ErrorAlertFormComponent,
    AddUserComponent,
    AdminHomeComponent,
    SubirEntradasComponent,
    DivisorComponent,
    EditPasswordComponent,
    PerfilComponent,
    NavbarComponent,
    ModifyMatchComponent,
    TranslationComponent,
    UsuariosComponent,
    RegisterAdminDialogComponent,
    ListUserComponent,
    FilterPipe,
    HabilitarEntradasComponent,
    AddEntradasUsuarioComponent,
    MatchAssistUserComponent,

  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    MatDatepickerModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    CommonModule,
    MatProgressSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [ HttpClient ]
      }
    })

  ],
  providers: [{provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})

export class AppModule {


}
