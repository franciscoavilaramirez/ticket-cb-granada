import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../../modelo/LoginResponse';
import { environment } from '../../../enviroments/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Lógica para manejar el envío del formulario correctamente
      this.successMessage = 'Formulario enviado correctamente.';

      // guardar sesion localstorage
      localStorage.setItem('user', JSON.stringify(this.loginForm.value));
      console.log("localstorage ==>",localStorage.getItem('user') || '{}');

    // guardar un valor específico en el localstorage
    let email = this.loginForm.get('email')?.value;
    localStorage.setItem('userEmail', email);
    console.log("localstorage email ==>",localStorage.getItem('userEmail'));

    let userId = this.loginForm.get('user_id')?.value;
    localStorage.setItem('userId', userId);
    console.log("localstorage ID ==>",localStorage.getItem('userId'));
    }

    const observer = {
      next: (response: LoginResponse) => {
        console.log('Success!', response);

        let user= {
          nombre: response.nombre,
          apellido: response.apellido,
          email: response.email,
          user_id: response.user_id,
          tickets: response.tickets,
          isAdmin: response._admin
        }
        let user1 = JSON.stringify(user);
        localStorage.setItem('user', user1);
        console.log("localstorage ID ==>",localStorage.getItem('user'));
      },
      error: (error: any) => {
        console.error('Error!', error);
        this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      }

    };

    this.http.post<LoginResponse>(environment.apiUrl+'login', this.loginForm.value).subscribe(observer);
  }
}
