import { LOCALE_ID, NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
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
import { ResetPasswordComponent } from './componentes/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './componentes/forgot-password/forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from "@angular/material/icon";
import { AuthInterceptor } from './service/auth.interceptor';

registerLocaleData(localeEs, 'es');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function initApp(tokenService: TokenService, router: Router) {
  return () => {
    const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/email'];
    const currentUrl = window.location.pathname;

    if (publicRoutes.includes(currentUrl)) {
      return Promise.resolve(true);
    }

    return tokenService.tokenConfig().catch(() => {
      router.navigate(['/login']);
      return Promise.resolve(false);
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    EmailConfirmacionComponent,
    ResetPasswordComponent
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
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    TranslateModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
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
    MatFormFieldModule,
    MatIconModule
],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [TokenService, Router],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
