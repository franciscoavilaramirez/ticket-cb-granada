import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../modelo/usuario';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { EditPasswordComponent } from '../../componentes/edit-password/edit-password.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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

  constructor(private formBuilder: FormBuilder, private apiService: ApiService,
              private router: Router, private http: HttpClient, public dialog: MatDialog) { }


  ngOnInit() {
    let user = localStorage.getItem('user');
    if (user == null)
      this.idUsuario = -1
    else {
      let userJson = JSON.parse(user);
      this.idUsuario = userJson.id
      //console.log("id usuario perfil: " + this.idUsuario)
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
        //console.log('this usuario',this.usuario)

        // Actualiza el FormGroup con los datos del usuario una vez cargados
        this.editarPerfil.patchValue({
          nombre: this.usuario.nombre,
          apellidos: this.usuario.apellidos,
          email: this.usuario.email
        });



        // this.usuario.id = this.idUsuario + "";
        // console.log("usuario perfil: " + JSON.stringify(this.usuario))
        // this.editarPerfil = this.formBuilder.group({
        //   nombre: [this.usuario.nombre, Validators.required],
        //   apellidos: [this.usuario.apellidos, Validators.required],
        //   email: [this.usuario.email, [Validators.required, Validators.email]],

        // });
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
