import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoginPageRoutingModule } from '../../pages/login-page/login-page-routing.module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
    MatCheckboxModule
  ],
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const email = this.form.value.email;
    this.api.requestPasswordReset(email).subscribe({
      next: () => {
        this.submitting = false;
        Swal.fire({
          title: this.translate.instant('passwordReset.request.successTitle'),
          html: this.translate.instant('passwordReset.request.successHtml'),
          icon: 'success',
          confirmButtonText: this.translate.instant('botones.cerrar') || 'Cerrar',
          customClass: {
            popup: 'custom-swal-popup',
            confirmButton: 'custom-swal-confirm'
          }
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err: any) => {
        this.submitting = false;
        console.error('requestPasswordReset error', err);

        const errorMessage =
          err?.error?.message ||
          this.translate.instant('passwordReset.request.errorEmailNotFound') ||
          'El correo electrónico introducido no está registrado.';

        Swal.fire({
          title: this.translate.instant('passwordReset.request.errorTitle') || 'Error',
          html: errorMessage,
          icon: 'error',
          confirmButtonText: this.translate.instant('botones.cerrar') || 'Cerrar',
          customClass: {
            popup: 'custom-swal-popup',
            confirmButton: 'custom-swal-confirm'
          }
        });
      }
    });
  }
}
