import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from './../../modelo/LoginResponse';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  onSubmit(): void {
    const observer = {
      next: (response: LoginResponse) => console.log('Success!', response),
      error: (error: any) => {
        console.error('Error!', error);
        this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      }

    };

    this.http.post<LoginResponse>('http://localhost:8080/cbgranada-api/v1/login', this.loginForm.value).subscribe(observer);
  }
}
