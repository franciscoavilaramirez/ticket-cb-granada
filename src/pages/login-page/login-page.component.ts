import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../../app/modelo/LoginResponse';
import { environment } from '../../enviroments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Si el usuario ya ha iniciado sesión, redirige a la página de inicio
    let user = localStorage.getItem('user');
    if (user != null) {
      let userJson = JSON.parse(user);
      userJson.isAdmin ? this.router.navigate(['/Admin-home']) : this.router.navigate(['/home']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const observer = {
      next: (response: LoginResponse) => {
        // console.log('Success!', response);

        let userJson = JSON.stringify(response);
        localStorage.setItem('user', userJson);
        console.log("localstorage ID ==>", localStorage.getItem('user'));
        // Redirige a la página de inicio
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        // console.error('Error!', error);
        this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      }
    };

    this.http.post<LoginResponse>(environment.apiUrl + 'login', this.loginForm.value).subscribe(observer);
  }
}
