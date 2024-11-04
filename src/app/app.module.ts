import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UpdateUserComponent } from './componentes/update-user/update-user.component';

import { AddUserComponent } from './componentes/add-user/add-user.component';
import { EditPasswordComponent } from './componentes/edit-password/edit-password.component';

import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { JwtModule } from "@auth0/angular-jwt";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AddEntradasUsuarioComponent } from './componentes/add-entradas-usuario/add-entradas-usuario.component';
import { ListUserComponent } from './componentes/list-user/list-user.component';
import { MatchAssistUserComponent } from './componentes/match-assist-user/match-assist-user.component';
import { ModifyMatchComponent } from './componentes/modify-match/modify-match.component';
import { RegisterAdminDialogComponent } from './componentes/register-admin-dialog/register-admin-dialog.component';
import { HabilitarEntradasComponent } from './pages/admin/habilitar-entradas/habilitar-entradas.component';
import { TranslationComponent } from './translation/translation.component';
import { EmailConfirmacionComponent } from './pages/email-confirmacion/email-confirmacion.component';
registerLocaleData(localeEs, 'es');



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    EmailConfirmacionComponent,
  ],
  imports: [
    // CommonModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UpdateUserComponent,
    AddUserComponent,
    EditPasswordComponent,
    ModifyMatchComponent,
    TranslationComponent,
    RegisterAdminDialogComponent,
    ListUserComponent,
    HabilitarEntradasComponent,
    AddEntradasUsuarioComponent,
    MatchAssistUserComponent,

    // MatButtonModule,
    // MatCardModule,
    // MatNativeDateModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatSnackBarModule,
    // MatTableModule,
    // MatIconModule,
    // MatSelectModule,
    // ReactiveFormsModule,
    // MatDialogModule,
    // MatCheckboxModule,
    // FormsModule,
    // MatDatepickerModule,
    // MatListModule,
    // MatMenuModule,
    // MatPaginatorModule,
    // MatProgressSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [ HttpClient ]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token')
      }
    })
  ],
  providers: [{provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})

export class AppModule {


}
