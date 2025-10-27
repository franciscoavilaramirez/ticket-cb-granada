import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '../../modelo/usuario';
import { MatDialog } from '@angular/material/dialog';
import { PerfilComponent } from '../../pages/perfil/perfil.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrl: './edit-password.component.scss',
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

  private readonly passwordPattern =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).{8,}$/;

  constructor(
    private service: ApiService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PerfilComponent>,
    @Inject(MAT_DIALOG_DATA) public userModify: Usuario
  ) {}

  ngOnInit() {
    this.editPassword = this.formBuilder.group(
      {
        contrasenaActual: [
          '',
          [Validators.required, Validators.pattern(this.passwordPattern)],
        ],
        contrasenaNueva: [
          '',
          [Validators.required, Validators.pattern(this.passwordPattern)],
        ],
        contrasenaRepetida: [
          '',
          [Validators.required, Validators.pattern(this.passwordPattern)],
        ],
      },
      {
        validators: this.checkPasswordsMatch,
      }
    );

    // Reactivar validaciones dinámicas y limpieza de errores al escribir
    const nueva = this.editPassword.get('contrasenaNueva');
    const repetida = this.editPassword.get('contrasenaRepetida');

    if (nueva && repetida) {
      this.subs.push(
        nueva.valueChanges.subscribe(() => {
          this.editPassword.updateValueAndValidity({
            onlySelf: false,
            emitEvent: false,
          });
        })
      );
      this.subs.push(
        repetida.valueChanges.subscribe(() => {
          this.editPassword.updateValueAndValidity({
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

  checkPasswordsMatch(group: AbstractControl | FormGroup | null): { [key: string]: any } | null {
    if (!group) return null;
    const pass = group.get('contrasenaNueva')?.value;
    const repeat = group.get('contrasenaRepetida')?.value;

    if (pass === undefined || repeat === undefined) {
      return null;
    }

    return pass === repeat ? null : { notSame: true };
  }

  checkPasswords() {
    if (!this.editPassword.valid) return;

    if (this.userModify?.id) {
      this.service
        .checkPasswords(
          this.userModify.id,
          this.editPassword.get('contrasenaActual')?.value
        )
        .subscribe((response) => {
          if (response === true) {
            const usuario: Usuario = {
              id: this.userModify.id,
              email: this.userModify.email,
              password: this.editPassword.get('contrasenaNueva')?.value,
              apellidos: this.userModify.apellidos,
              partidosAsistidos: this.userModify.partidosAsistidos,
              nombre: this.userModify.nombre,
              _admin: this.userModify._admin,
            };

            this.service.modifyUser(usuario).subscribe(() => {
              this.closedModal();
            });
          } else {
            alert('La contraseña actual no es correcta');
          }
        });
    } else {
      alert('Id usuario indefinido');
    }
  }

  closedModal() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
