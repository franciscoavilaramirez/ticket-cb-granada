import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '../../modelo/usuario';
import { PerfilComponent } from '../../pages/perfil/perfil.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss'],
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
    MatDialogModule,
    MatButtonModule,
  ],
})
export class EditPasswordComponent implements OnInit {
  editPassword!: FormGroup;
  hidePassword: { [key: string]: boolean } = {
    actual: true,
    nueva: true,
    repetida: true,
  };
  private subs: Subscription[] = [];
  submitting = false;

  private readonly passwordPattern =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).{8,}$/;

  constructor(
    private service: ApiService,
    public dialogRef: MatDialogRef<PerfilComponent>,
    @Inject(MAT_DIALOG_DATA) public userModify: Usuario,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.editPassword = this.formBuilder.group(
      {
        contrasenaActual: ['', [Validators.required]],
        contrasenaNueva: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
        contrasenaRepetida: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      },
      { validators: this.checkPasswordsMatch }
    );

    const nueva = this.editPassword.get('contrasenaNueva');
    const repetida = this.editPassword.get('contrasenaRepetida');

    if (nueva && repetida) {
      this.subs.push(
        nueva.valueChanges.subscribe(() => this.editPassword.updateValueAndValidity({ emitEvent: false }))
      );
      this.subs.push(
        repetida.valueChanges.subscribe(() => this.editPassword.updateValueAndValidity({ emitEvent: false }))
      );
    }
  }

  clickEvent(field: string, event: MouseEvent) {
    if (this.hidePassword.hasOwnProperty(field)) {
      this.hidePassword[field] = !this.hidePassword[field];
    }
    event.stopPropagation();
  }

  checkPasswordsMatch(group: AbstractControl | FormGroup | null): { [key: string]: any } | null {
    if (!group) return null;
    const pass = group.get('contrasenaNueva')?.value;
    const repeat = group.get('contrasenaRepetida')?.value;
    return pass && repeat && pass !== repeat ? { notSame: true } : null;
  }

  private resolveUserId(): number | null {
    const anyUser: any = this.userModify;
    return anyUser?.id || anyUser?.user_id || anyUser?.userId || null;
  }

  checkPasswords() {
    this.editPassword.markAllAsTouched();
    if (!this.editPassword.valid) {
      Swal.fire({
        icon: 'warning',
        title: this.translate.instant('errores.formularioInvalido'),
        text: this.translate.instant('errores.contrasenasNoCoinciden'),
        confirmButtonText: this.translate.instant('botones.cerrar'),
        confirmButtonColor: '#e20074'
      });
      return;
    }

    const userId = this.resolveUserId();
    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ID usuario indefinido',
        confirmButtonText: this.translate.instant('botones.cerrar'),
        confirmButtonColor: '#e20074'
      });
      return;
    }

    const actual = this.editPassword.get('contrasenaActual')?.value;
    this.submitting = true;

    this.service.checkPasswords(userId, actual).subscribe({
      next: (response) => {
        if (response === true) {
          const usuarioPayload: any = {
            id: userId,
            email: this.userModify.email,
            password: this.editPassword.get('contrasenaNueva')?.value,
            apellidos: this.userModify.apellidos,
            partidosAsistidos: (this.userModify as any).partidosAsistidos,
            nombre: this.userModify.nombre,
            _admin: (this.userModify as any)._admin,
          };

          this.service.updateUser(userId, usuarioPayload).subscribe({
            next: () => {
              this.submitting = false;
              Swal.fire({
                icon: 'success',
                title: this.translate.instant('passwordReset.reset.successTitle'),
                html: this.translate.instant('passwordReset.reset.successHtml'),
                confirmButtonText: this.translate.instant('botones.cerrar'),
                confirmButtonColor: '#36bf98'
              }).then(() => this.closedModal());
            },
            error: () => {
              this.submitting = false;
              Swal.fire({
                icon: 'error',
                title: this.translate.instant('passwordReset.reset.errorTitle'),
                html: this.translate.instant('passwordReset.reset.errorHtml'),
                confirmButtonText: this.translate.instant('botones.cerrar'),
                confirmButtonColor: '#e20074'
              });
            }
          });
        } else {
          this.submitting = false;
          Swal.fire({
            icon: 'error',
            title: this.translate.instant('passwordReset.reset.errorCurrentPasswordTitle'),
            text: this.translate.instant('passwordReset.reset.errorCurrentPasswordText'),
            confirmButtonText: this.translate.instant('botones.cerrar'),
            confirmButtonColor: '#e20074'
          });
        }
      },
      error: () => {
        this.submitting = false;
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('errores.errorTitulo'),
          text: this.translate.instant('passwordReset.reset.errorHtml'),
          confirmButtonText: this.translate.instant('botones.cerrar'),
          confirmButtonColor: '#e20074'
        });
      }
    });
  }

  closedModal() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
