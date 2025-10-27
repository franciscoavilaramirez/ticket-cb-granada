import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ErrorAlertFormComponent } from '../error-alert-form/error-alert-form.component';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-admin-dialog',
  templateUrl: './register-admin-dialog.component.html',
  styleUrl: './register-admin-dialog.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    TranslateModule,
    MatIconModule,
    ErrorAlertFormComponent,
    MatButtonModule,
  ],
})
export class RegisterAdminDialogComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  private subs: Subscription[] = [];

  private readonly passwordPattern =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).{8,}$/;

  // 🔧 Claves corregidas para coincidir con el HTML
  hidePassword: { [key: string]: boolean } = {
    contrasenaNueva: true,
    contrasenaRepetida: true,
  };

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private matDialogRef: MatDialogRef<RegisterAdminDialogComponent>
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.pattern(this.passwordPattern)],
        ],
        repeatPassword: ['', Validators.required],
        _admin: false,
      },
      { validators: this.checkPasswords }
    );

    // Reactivar validaciones dinámicas
    const pass = this.registerForm.get('password');
    const repeat = this.registerForm.get('repeatPassword');

    if (pass && repeat) {
      this.subs.push(
        pass.valueChanges.subscribe(() => {
          this.registerForm.updateValueAndValidity({
            onlySelf: false,
            emitEvent: false,
          });
        })
      );
      this.subs.push(
        repeat.valueChanges.subscribe(() => {
          this.registerForm.updateValueAndValidity({
            onlySelf: false,
            emitEvent: false,
          });
        })
      );
    }
  }

  clickEvent(field: string, event: MouseEvent) {
    if (this.hidePassword.hasOwnProperty(field)) {
      this.hidePassword[field] = !this.hidePassword[field];
    }
    event.stopPropagation();
  }

  checkPasswords(group: AbstractControl | FormGroup | null): {
    [key: string]: any;
  } | null {
    if (!group) return null;
    const pass = group.get('password')?.value;
    const repeat = group.get('repeatPassword')?.value;

    if (pass === undefined || repeat === undefined) return null;
    return pass === repeat ? null : { notSame: true };
  }

  register() {
    if (this.registerForm.valid) {
      this.http.post(environment.apiUrl + 'addUser', this.registerForm.value).subscribe({
        next: () => {
          Swal.fire('Usuario registrado', '', 'success');
          this.matDialogRef.close();
        },
        error: () => {
          Swal.fire(
            'Error de registro',
            'Compruebe que el email no esté en uso',
            'error'
          );
        },
      });
    }
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
