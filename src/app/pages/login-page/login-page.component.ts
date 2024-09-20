import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';
import { Router } from '@angular/router';
import { TokenService } from '../../service/token.service';

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
    // let userString = localStorage.getItem('user');
    // if (userString != null) {
    //   let user = JSON.parse(userString);
    //   user.isAdmin ? this.router.navigate(['/admin-home']) : this.router.navigate(['/home']);
    // }

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    //debugger;
    const observer = {


      next: (response: any) => {
        //debugger;
        //let userString = JSON.stringify(response);
        //const token = response;

        localStorage.setItem('token', response.token);


      // Hardcodear un token temporal
      //const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGVsbGlkb3MiOiJhdmlsYSIsImVtYWlsIjoiRnJhbmNpc2NvQEF2aWxhLmNvbSIsImlkIjo0NCwiaXNBZG1pbiI6InRydWUiLCJub21icmUiOiJGcmFuY2lzY28iLCJwYXJ0aWRvc0FzaXN0aWRvcyI6MH0.9cMIIEGZMIONON9DQpjMAiIWu6gPQuaq-YSDwWhXsKI';  // Esto será reemplazado por el token real luego

      // Almacenar usuario y token en localStorage
      //localStorage.setItem('user', userString);
      //localStorage.setItem('token', token);



       // localStorage.setItem('user', userString);
        if(response.isAdmin) {
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
