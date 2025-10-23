import { LOCALE_ID, NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { JwtModule } from "@auth0/angular-jwt";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UpdateUserComponent } from './componentes/update-user/update-user.component';
import { AddUserComponent } from './componentes/add-user/add-user.component';
import { EditPasswordComponent } from './componentes/edit-password/edit-password.component';
import { AddEntradasUsuarioComponent } from './componentes/add-entradas-usuario/add-entradas-usuario.component';
import { ListUserComponent } from './componentes/list-user/list-user.component';
import { MatchAssistUserComponent } from './componentes/match-assist-user/match-assist-user.component';
import { ModifyMatchComponent } from './componentes/modify-match/modify-match.component';
import { RegisterAdminDialogComponent } from './componentes/register-admin-dialog/register-admin-dialog.component';
import { HabilitarEntradasComponent } from './pages/admin/habilitar-entradas/habilitar-entradas.component';
import { TranslationComponent } from './translation/translation.component';
import { EmailConfirmacionComponent } from './pages/email-confirmacion/email-confirmacion.component';
import { Router } from '@angular/router';
import { TokenService } from './service/token.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

registerLocaleData(localeEs, 'es');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function initApp(tokenService: TokenService, router: Router) {
  return () =>
    tokenService.tokenConfig().catch(() => {
      router.navigate(['/login']);
      return Promise.resolve(false);
    });
}

@NgModule({
  declarations: [
    AppComponent,
    EmailConfirmacionComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UpdateUserComponent,
    AddUserComponent,
    EditPasswordComponent,
    ModifyMatchComponent,
    TranslationComponent,
    MatCheckboxModule,
    RegisterAdminDialogComponent,
    ListUserComponent,
    HabilitarEntradasComponent,
    AddEntradasUsuarioComponent,
    MatchAssistUserComponent,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
      },
    }),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [TokenService, Router],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
