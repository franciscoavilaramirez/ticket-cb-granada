import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';
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
  successMessage: string;

  constructor(private tokenService: TokenService, private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private userService:UserService) { }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const observer = {
      next: (response: any) => {
        //debugger;
        console.log('response desde login-page',response)
        localStorage.setItem('token', response.token);

        const jwt = new JwtHelperService();
        const tokenDecoded = jwt.decodeToken(response.token); // Pasamos la variable 'token' aquí
        //console.log('Token decodificado desde login-page:', tokenDecoded);
        this.tokenService.token = response.token;
        if(tokenDecoded.usuario.isAdmin == true) {
          this.router.navigate(['/admin-home'])
        }
        else
          this.router.navigate(['/home']);
      },
      error: (error: any) => {
        this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      }
    }
    this.http.post<any>(environment.apiUrl + 'login', this.loginForm.value).subscribe(observer);
  }

}
