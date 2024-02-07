import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';
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
    let userString = localStorage.getItem('user');
    if (userString != null) {
      let user = JSON.parse(userString);
      user.isAdmin ? this.router.navigate(['/admin-home']) : this.router.navigate(['/home']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const observer = {
      next: (user: any) => {
        let userString = JSON.stringify(user);
        localStorage.setItem('user', userString);
        if(user.isAdmin) {
          this.router.navigate(['/admin-home'])
        }
        else
          this.router.navigate(['/home']);
      },
      error: (error: any) => {
        this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      }
    };
    this.http.post<any>(environment.apiUrl + 'login', this.loginForm.value).subscribe(observer);
  }
}
