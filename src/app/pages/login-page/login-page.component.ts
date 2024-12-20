import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '../../service/token.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  errorDevClient: string = '';
  successMessage: string;
  hidePassword: { [key: string]: boolean } = {
    contrasena: true,
  };

  constructor(private tokenService: TokenService, private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private userService:UserService) { }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  clickEvent(field: string, event: MouseEvent) {
    event.preventDefault();
    if (this.hidePassword.hasOwnProperty(field)) {
      this.hidePassword[field] = !this.hidePassword[field];
    }
  }

  onSubmit(): void {
    const observer = {
      next: (response: any) => {
        //debugger;
        localStorage.setItem('token', response.token);

        const jwt = new JwtHelperService();
        const tokenDecoded = jwt.decodeToken(response.token); // Pasamos la variable 'token' aquí
        this.tokenService.token = response.token;
        if(tokenDecoded.usuario.isAdmin == true) {
          this.router.navigate(['/admin-home'])
        }
        else
          this.router.navigate(['/home']);
      },
      error: (error: any) => {
        this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
        this.errorDevClient = 'Si estás registrándote con una maqueta DevClient internet es posible que falle el registro.Estamos trabajando para solucionarlo con el Dpto correspondiente.';

      }
    }
    this.http.post<any>(environment.apiUrl + 'login', this.loginForm.value).subscribe(observer);
  }

}
