import { Component, Inject } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HomeComponent } from '../home/home.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../modelo/usuario';
import { Partido } from '../../modelo/partidos';

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
    public dialogRef: MatDialogRef<HomeComponent>,@Inject(MAT_DIALOG_DATA) public partido: Partido
    ){}

    ngOnInit(){
     this.getUsers();
    }
    getUsers(){
      this.service.getUsers().subscribe(data=>{
        this.usuarios = data;
       });
    }

    onSubmit(){
      this.usuariosPartido.forEach(usuPartido =>{
        this.service.addUserMatch(usuPartido,this.partido).subscribe(data =>{

        this.closedModal();
        });
      })

      //}
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

  //   addUserToSorteo(userId: any, isChecked: boolean){
  //   if (isChecked) {
  //     // Agregar usuario al array si está marcado
  //     this.usuariosPartido = [...this.usuariosPartido, userId];
  //   } else {
  //     // Quitar usuario del array si está desmarcado
  //     this.usuariosPartido = this.usuariosPartido.filter(id => id !== userId);
  //   }
  //   console.log("array usuariosPartido",this.usuariosPartido);
  // }



      closedModal(): void {
          this.dialogRef.close();
      }

}
