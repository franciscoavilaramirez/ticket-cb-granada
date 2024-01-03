import { Component } from '@angular/core';
import { Usuario } from '../../modelo/empleados';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from './../../service/service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private snackBar: MatSnackBar,public service: ServiceService, private router: Router,public dialog: MatDialog) {
  }


  bodyResponse: Usuario;
  currentUser: Usuario;
  loginForm: FormGroup;




  Login(){
    if(this.loginForm.valid){
      const nombre = this.loginForm.get("nombre")?.value;
      const email = this.loginForm.get("email")?.value;
      const contrasena = this.loginForm.get("contrasena")?.value;

      //const contraseña = this.loginForm.get("contraseña")?.value;
      console.log("nombre", nombre,"email",email);

      this.bodyResponse = {

        nombre:nombre,
        email:email,
        apellido: 'lopez',
        is_admin: false,
        contrasena: contrasena

      }
    }

      //creo que la funcion onsubmit en vez de log in lo que hace es añadir un usuario. voy a intentar pedir el usuario al servicio para
      //después cargar la variable currentUser como ese.
      
      this.currentUser = this.service.Login(this.bodyResponse)
  }
}
