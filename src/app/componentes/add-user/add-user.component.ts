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




    //ESTE ES EL METODO ONSUBMIT QUE AGREGA BIEN UN USUARIO
    // onSubmit(){
    //   this.usuariosPartido.forEach(usuPartido =>{
    //     this.service.addUserMatch(usuPartido,this.partido).subscribe(data =>{
    //       console.log("usuario agregado a partido correctamente",data)
    //     // this.closedModal();
    //     // this.snackBar.open('Usuario agregado correctamente', 'Cerrar', {
    //     //   duration: 3000,  // Duración del mensaje en milisegundos
    //     // });
    //     });
    //   })
    // }

    onSubmit() {
      debugger
      this.usuariosPartido.forEach(userId => {
        // Verifica si el usuario ya está en el array
        if (!this.isUsuarioAlreadyAdded(userId)) {
          console.log('Agregando usuario al partido:', userId);
          // Simula la llamada al servicio
          // this.service.addUserMatch(userId, this.partido).subscribe(data => {
          //   console.log("Usuario agregado a partido correctamente", data);
          //   this.closedModal();
          // });

          // Agrega el usuario al array solo si aún no está presente
          this.usuariosPartido.push(userId);
        } else {
          console.log('El usuario ya está en el partido:', userId);
          // Muestra un MatSnackBar indicando que el usuario ya está en el partido
          // this.snackBar.open('¡Este usuario ya está en el partido!', 'Cerrar', {
          //   duration: 5000,
          // });
        }
      });

      // Puedes agregar aquí el código para cerrar el modal y mostrar el Snackbar según tus necesidades
    }

    // Función para verificar si el usuario ya está en el array
    isUsuarioAlreadyAdded(userId: string): boolean {
      return this.usuariosPartido.includes(userId);
    }


      closedModal(): void {
          this.dialogRef.close();
      }

}
