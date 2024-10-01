import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-admin-dialog',
  templateUrl: './register-admin-dialog.component.html',
  styleUrl: './register-admin-dialog.component.scss'
})
export class RegisterAdminDialogComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/;
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
