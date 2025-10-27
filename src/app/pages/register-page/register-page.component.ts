import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  errorMessage = '';
  errorDevClient = '';
  hidePassword: { contrasena: boolean; repiteContrasena: boolean } = {
    contrasena: true,
    repiteContrasena: true
  };

  private subs: Subscription[] = [];

  private readonly passwordPattern =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).{8,}$/;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
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

  ngOnInit() {

    this.registerForm = this.formBuilder.group(
      {
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        email: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@t-systems\\.com$')]
        ],
        password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
        repeatPassword: ['', Validators.required],
      },
      {
        validators: this.checkPasswords
      }
    );

    this.subs.push(
      this.registerForm.valueChanges.subscribe(() => {
        this.errorMessage = '';
        this.errorDevClient = '';
      })
    );
  }

  clickEvent(field: 'contrasena' | 'repiteContrasena', event: MouseEvent) {
    event.preventDefault();
    this.hidePassword[field] = !this.hidePassword[field];
  }

  checkPasswords(group: AbstractControl | FormGroup | null): { [key: string]: any } | null {
    if (!group) return null;
    const pass = group.get('password')?.value;
    const repeat = group.get('repeatPassword')?.value;
    return pass === repeat ? null : { notSame: true };
  }

  register() {
    this.registerForm.markAllAsTouched();

    if (!this.registerForm.valid) {
      this.errorMessage = 'errores.formularioInvalido';
      return;
    }

    const { nombre, apellidos, email, password } = this.registerForm.value;
    const payload = { nombre, apellidos, email, password };

    this.http.post(environment.apiUrl + 'addUser', payload).subscribe({
      next: (response: any) => {
        const userJson = response;
        const user = {
          userEmail: userJson.email,
          isAdmin: userJson._admin,
          userName: userJson.nombre,
          userId: userJson.user_id,
          userApellidos: userJson.apellidos
        };
        localStorage.setItem('user', JSON.stringify(user));

        this.router.navigate(['/']);
        Swal.fire(
          this.translate.instant('errores.usuarioRegistradoExito'),
          this.translate.instant('errores.usuarioRegistradoVerificarCorreo'),
          'success'
        );
      },
      error: () => {
        this.errorMessage = 'errores.errorRegistro';
        this.errorDevClient = 'errores.errorDevClient';
        Swal.fire(this.translate.instant('errores.errorRegistroSwal'), '', 'error');
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
