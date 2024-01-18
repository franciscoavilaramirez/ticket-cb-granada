import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../../app/modelo/LoginResponse';
import { environment } from '../../enviroments/environment';

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
        let userJson = JSON.stringify(user);
        localStorage.setItem('user', userJson);
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
