import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-register-admin-dialog',
  templateUrl: './register-admin-dialog.component.html',
  styleUrl: './register-admin-dialog.component.scss'
})
export class RegisterAdminDialogComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/;
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

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
    console.log(this.registerForm.value)
    if (this.registerForm.valid) {
      this.http.post(environment.apiUrl + 'addUser', this.registerForm.value).subscribe({
        next: (response) => {
          console.log(response)
        },
        error: error => {
          // Maneja el error aquí
          alert("Error al registrar el usuario")
          console.log("Error al registrar el usuario", error);
          //this.errorMessage = 'Error al registrar el usuario. Email ya está en uso. Por favor, inténtalo de nuevo.';
        }
      });
    }
  }
}
