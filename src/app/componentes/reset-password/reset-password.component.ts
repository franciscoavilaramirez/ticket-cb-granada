import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  token: string | null = null;
  submitting = false;
  hidePassword: { [key: string]: boolean } = { password: true, repeatPassword: true };

  private readonly passwordPattern =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).{8,}$/;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      repeatPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });

    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');

      if (this.token) {
        this.api.verifyResetToken(this.token).subscribe({
          next: (res: any) => {
            if (!res.success) {
              this.handleInvalidToken();
            }
          },
          error: () => {
            this.handleInvalidToken();
          }
        });
      } else {
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  clickEvent(field: string, event: MouseEvent) {
    event.preventDefault();
    if (this.hidePassword.hasOwnProperty(field)) {
      this.hidePassword[field] = !this.hidePassword[field];
    }
  }

  private handleInvalidToken() {
    Swal.fire({
      title: this.translate.instant('passwordReset.reset.invalidTokenTitle'),
      text: this.translate.instant('passwordReset.reset.invalidTokenText'),
      icon: 'error',
      confirmButtonText: this.translate.instant('botones.cerrar')
    }).then(() => this.router.navigate(['/forgot-password']));
  }

  passwordsMatch(group: AbstractControl | null) {
    if (!group) return null;
    const p = group.get('password')?.value;
    const r = group.get('repeatPassword')?.value;
    return p && r && p !== r ? { notSame: true } : null;
  }

  submit() {
    if (!this.token) {
      this.showTokenError('invalid');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const newPassword = this.form.value.password;

    this.api.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.submitting = false;
        Swal.fire({
          title: this.translate.instant('passwordReset.reset.successTitle'),
          html: this.translate.instant('passwordReset.reset.successHtml'),
          icon: 'success',
          confirmButtonText: this.translate.instant('botones.cerrar'),
          customClass: { popup: 'custom-swal-popup', confirmButton: 'custom-swal-confirm' }
        }).then(() => this.router.navigate(['/login']));
      },
      error: (err) => {
        console.error('resetPassword error', err);
        this.submitting = false;
        this.showTokenError('expired');
      }
    });
  }

  private showTokenError(type: 'invalid' | 'expired') {
    const title =
      type === 'expired'
        ? this.translate.instant('passwordReset.reset.tokenExpiredTitle')
        : this.translate.instant('passwordReset.reset.invalidTokenTitle');
    const text =
      type === 'expired'
        ? this.translate.instant('passwordReset.reset.tokenExpiredText')
        : this.translate.instant('passwordReset.reset.invalidTokenText');

    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: this.translate.instant('botones.cerrar'),
      confirmButtonColor: '#e20074'
    }).then(() => {
      this.router.navigate(['/forgot-password']);
    });
  }
}
