import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ErrorAlertFormComponent } from '../error-alert-form/error-alert-form.component';

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
    ErrorAlertFormComponent
  ],
})
export class RegisterAdminDialogComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/;
  hidePassword: { [key: string]: boolean } = {
    contrasenaNueva: true,
    contrasenaRepetida: true
  };


  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private matDialogRef: MatDialogRef<RegisterAdminDialogComponent>) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.regex)]],
      repeatPassword: ['', Validators.required],
      _admin: false
    }, { validator: this.checkPasswords });
  }
  clickEvent(field: string, event: MouseEvent) {
    if (this.hidePassword.hasOwnProperty(field)) {
      this.hidePassword[field] = !this.hidePassword[field];
    }
    event.stopPropagation();
  }

  checkPasswords(group: FormGroup) {
    let passControl = group.get('password');
    let confirmPassControl = group.get('repeatPassword');

    if (passControl && confirmPassControl) {
      let pass = passControl.value;
      let confirmPass = confirmPassControl.value;

      return pass === confirmPass ? null : { notSame: true }
    }

    return { notSame: true };
  }

  register() {
    if (this.registerForm.valid) {
      this.http.post(environment.apiUrl + 'addUser', this.registerForm.value).subscribe({
        next: (response) => {
          Swal.fire("Usuario registrado", "", "success");
          this.matDialogRef.close()
        },
        error: error => {
          alert("Error de registro. Compruebe que el email no esté en uso")
          console.log("Error al registrar el usuario.", error);
        }
      });
    }
  }
}
