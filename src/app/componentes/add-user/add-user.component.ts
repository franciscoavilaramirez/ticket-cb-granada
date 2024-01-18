import { Component, Inject } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HomeComponent } from '../home/home.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../modelo/usuario';
import { Partido } from '../../modelo/partidos';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

  // addUserForm: FormGroup;
  // partidos: Partido[];


      //crear array usuariosPartido
    //  revisar metodo onchange del matcheckbox para añadir o quitar usuarios al array usuariosPartidos
   // crear boton guardar que recorra usuariosPartido y por cada usuario que haya en el array lanzar peticion addUserMatch
usuarios: Usuario[];
usuariosPartido: string[]= [];

  constructor(private service:ServiceService,public dialog: MatDialog,
    public dialogRef: MatDialogRef<HomeComponent>,@Inject(MAT_DIALOG_DATA) public partido: Partido,
    public snackBar: MatSnackBar
    ){}

    ngOnInit(){
     this.getUsers();
    }
    getUsers(){
      this.service.getUsers().subscribe(data=>{
        this.usuarios = data;
       });
    }
    addUserToSorteo(userId: string) {
      const index = this.usuariosPartido.indexOf(userId);

      if (index === -1) {
        // El usuario no está en el array, agregarlo
        this.usuariosPartido.push(userId);
      } else {
        // El usuario está en el array, quitarlo
        this.usuariosPartido.splice(index, 1);
      }
      console.log('usuariosPartido', this.usuariosPartido);
    }
    onSubmit() {
      const usuariosAgregados: string[] = [];

      this.usuariosPartido.forEach(usuPartido => {
        // Verifica si el usuario ya está en el array
        if (!this.usuariosPartido.includes(usuPartido)) {
          usuariosAgregados.push(usuPartido);
          console.log('usuPartido',usuPartido)

          // Simula la llamada al servicio
          // this.service.addUserMatch(usuPartido, this.partido).subscribe(data => {
          //   console.log("Usuario agregado a partido correctamente", data);
          //   this.closedModal();
          //   this.snackBar.open('Usuario agregado correctamente', 'Cerrar', {
          //     duration: 3000,  // Duración del mensaje en milisegundos
          //   });
          // });
        }
      });

      if (usuariosAgregados.length > 0) {
        console.log('Usuarios agregados:', usuariosAgregados);
        // this.closedModal();
        // this.snackBar.open('Usuarios agregados correctamente', 'Cerrar', {
        //   duration: 3000,  // Duración del mensaje en milisegundos
        // });
      } else {
        console.log('Ningún usuario nuevo para agregar');
      }
    }


    //ESTE ES EL METODO ONSUBMIT QUE AGREGA BIEN UN USUARIO
    // onSubmit(){
    //   this.usuariosPartido.forEach(usuPartido =>{
    //     this.service.addUserMatch(usuPartido,this.partido).subscribe(data =>{
    //       console.log("usuario agregado a partido correctamente",data)
    //     this.closedModal();
    //     this.snackBar.open('Usuario agregado correctamente', 'Cerrar', {
    //       duration: 3000,  // Duración del mensaje en milisegundos
    //     });
    //     });
    //   })
    // }

    // onSubmit() {
    //   this.usuariosPartido.forEach(userId => {
    //     // Verifica si el usuario ya está en el array
    //     if (!this.isUsuarioAlreadyAdded(userId)) {
    //       console.log('se agrega user',userId)
    //       // this.service.addUserMatch(userId, this.partido).subscribe(data => {
    //       //   console.log("Usuario agregado a partido correctamente", data);
    //       //   this.closedModal();
    //       // });
    //     } else {
    //       console.log('ya está agregado user',userId)
    //       // Muestra un MatSnackBar indicando que el usuario ya está agregado
    //       // this.snackBar.open('¡Este usuario ya está agregado!', 'Cerrar', {
    //       //   duration: 5000,
    //       // });
    //     }
    //   });
    // }
    // // Función para verificar si el usuario ya está en el array
    //  isUsuarioAlreadyAdded(userId: string): boolean {
    //   return this.usuariosPartido.includes(userId);
    // }
    // onSubmit() {
    //   for (const userId of this.usuariosPartido) {
    //     // Verifica si el usuario ya está en el array
    //     const isUsuarioAlreadyAdded = this.usuariosPartido.includes(userId);

    //     if (!isUsuarioAlreadyAdded) {
    //       console.log('Agregando usuario:', userId);
    //       // Simula la llamada al servicio
    //       // this.service.addUserMatch(userId, this.partido).subscribe(data => {
    //       //   console.log("Usuario agregado a partido correctamente", data);
    //       //   this.closedModal();
    //       // });
    //     } else {
    //       // Muestra un MatSnackBar indicando que el usuario ya está agregado
    //       console.log('Usuario ya está agregado:', userId);
    //       // this.snackBar.open('¡Este usuario ya está agregado!', 'Cerrar', {
    //       //   duration: 5000,
    //       // });
    //     }
    //   }
    // }

      closedModal(): void {
          this.dialogRef.close();
      }

}
