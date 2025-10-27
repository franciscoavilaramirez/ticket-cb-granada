import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '../../service/token.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string = '';
  errorDevClient: string = '';
  hidePassword: { [key: string]: boolean } = { contrasena: true };
  private langSub: Subscription;

  constructor(
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private translate: TranslateService
  ) {
    translate.addLangs(['es', 'en']);
    const storedLang = localStorage.getItem('lang');
    const browserLang = navigator.language || navigator.languages[0] || 'es';
    const shortLang = browserLang.split('-')[0];
    const selectedLang = storedLang || (['es', 'en'].includes(shortLang) ? shortLang : 'es');

    translate.setDefaultLang('es');
    translate.use(selectedLang);
  }

  ngOnInit(): void {
    const rememberedEmail = localStorage.getItem('rememberedEmail') || '';

    this.loginForm = this.formBuilder.group({
      email: [rememberedEmail, Validators.required],
      password: ['', Validators.required],
      rememberMe: [!!rememberedEmail]
    });

    this.langSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.use(event.lang);
    });
  }

  ngOnDestroy(): void {
    if (this.langSub) this.langSub.unsubscribe();
  }

  clickEvent(field: string, event: MouseEvent) {
    event.preventDefault();
    if (this.hidePassword.hasOwnProperty(field)) {
      this.hidePassword[field] = !this.hidePassword[field];
    }
  }

  onSubmit(): void {
    const { email, password, rememberMe } = this.loginForm.value;

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    this.http.post<any>(environment.apiUrl + 'login', { email, password }).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        const jwt = new JwtHelperService();
        const tokenDecoded = jwt.decodeToken(response.token); // Pasamos la variable 'token' aquí
        this.tokenService.token = response.token;

        if (tokenDecoded.usuario.isAdmin) {
          this.router.navigate(['/admin-home']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.errorMessage = this.translate.instant('errores.errorLogin');
        this.errorDevClient = this.translate.instant('errores.errorDevClient');
      }
    });
  }
}
