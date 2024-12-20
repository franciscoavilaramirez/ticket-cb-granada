import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  errorDevClient: string = '';
  hidePassword: { contrasena: boolean; repiteContrasena: boolean } = {
    contrasena: true,
    repiteContrasena: true
  };
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private translate: TranslateService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@t-systems\.com$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[@#$%^&+=*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$")]],
      repeatPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
    this.translate.use('en');
  }

  clickEvent(field: 'contrasena' | 'repiteContrasena', event: MouseEvent) {
    event.preventDefault();
    this.hidePassword[field] = !this.hidePassword[field];
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
          let userString = JSON.stringify(response);
          let userJson = JSON.parse(userString);
          let user = { "userEmail": userJson.email, "isAdmin": userJson._admin, "userName": userJson.nombre, "userId": userJson.user_id, "userApellidos": userJson.apellidos }
          localStorage.setItem('user', JSON.stringify(user));

          // Redirige a la página de inicio 
          this.router.navigate(['/']);
          Swal.fire("Usuario registrado correctamente, diríjase a la bandeja de entrada del correo que ha usado para validarlo", "", "success");
        },
        error: error => {
          // Maneja el error aquí
          Swal.fire("Error al registrar usuario", "", "error");
          this.errorMessage = 'Error al registrar el usuario. Email ya está en uso. Por favor, inténtalo de nuevo.';
          this.errorDevClient = 'Si estás registrándote con una maqueta DevClient internet es posible que falle el registro.Estamos trabajando para solucionarlo con el Dpto correspondiente.';

        }
      });
    }
  }
}
