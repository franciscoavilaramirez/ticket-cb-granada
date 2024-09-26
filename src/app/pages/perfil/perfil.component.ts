import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../modelo/usuario';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { EditPasswordComponent } from '../../componentes/edit-password/edit-password.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  editarPerfil: FormGroup;
  usuario: Usuario;
  idUsuario: number
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private apiService: ApiService,private userService:UserService,
              private router: Router, private http: HttpClient, public dialog: MatDialog, private jwtHelper:JwtHelperService) { }


  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("token desde el perfil " + token);
        // Decodifica el token
        const tokenDecoded = this.jwtHelper.decodeToken(token);
        // Configurar los datos del usuario en el UserService
        this.userService.setUserData(tokenDecoded.usuario);
        // Almacena el ID del usuario decodificado
        this.idUsuario = tokenDecoded.usuario?.id;
    } else {
      console.log('No se encontró el token en el localStorage');
      this.router.navigate(['/login']); // Si no hay token, redirigir al login
      return;
    }
    // Inicializa el FormGroup antes de cargar los datos del usuario para evitar errores de referencia
    this.editarPerfil = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.apiService.getUsuarioById(this.idUsuario).subscribe(
      usuario => {
        this.usuario = usuario
        console.log('this usuario',this.usuario)

        // Actualiza el FormGroup con los datos del usuario una vez cargados
        this.editarPerfil.patchValue({
          nombre: this.usuario.nombre,
          apellidos: this.usuario.apellidos,
          email: this.usuario.email
        });
      },
      error => {
        this.errorMessage = "Error al cargar el usuario";
        console.error(error);
      }
    )
  }
  async editar() {
    const usuario: Usuario = this.editarPerfil.value;
    usuario.id = this.idUsuario + "";
    await Swal.fire({
      title: '¿Guardar cambios?',
      showDenyButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
      confirmButtonColor: '#36BF98',
      denyButtonColor: 'grey',
    }).then((response) => {
      if (response.isConfirmed)
        this.apiService.modifyUser(usuario).subscribe()
    });
  }

  cambiarPassword(usuario: Usuario) {
    usuario.id = this.idUsuario + "";
    this.dialog.open(EditPasswordComponent, {
      data: usuario,
      width: '450px',
      height: '600px'
    });
  }

  // Con el metodo cancelar se pretende volver a la página home correspondiente al tipo de usuario
  // que hay registrado en ese preciso momento
cancelar() {
  if(this.usuario._admin === true){
    //console.log('this usuario es admin')
        this.router.navigate(['/admin-home']);

  }else {
    //console.log('this usuario no es admin')
        this.router.navigate(['/home']);
  }
  }
  cerrarSesion() {
    localStorage.removeItem('user')
    this.router.navigate(['/login']);
  }
}
