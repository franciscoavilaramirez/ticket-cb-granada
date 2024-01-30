import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../modelo/usuario';
import { Partido } from '../../modelo/partido';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';
import Swal from 'sweetalert2';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

usuariosYaInscritos: Usuario[];
usuarios: Usuario[];
usuariosParaAnadirAlPartido: string[]= [];

  constructor(private service:ApiService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdminHomeComponent>,@Inject(MAT_DIALOG_DATA) public partido: Partido,
    public snackBar: MatSnackBar
    ){}

    ngOnInit(){
     this.getUsuariosPartido(this.partido.id);

    }
    getUsers(){
      this.service.getUsers().subscribe(data=>{
        this.usuarios = [];
        data.forEach(usu =>{
          const user = this.usuariosYaInscritos?.find(usuInscrito =>{
           return  usu.user_id === usuInscrito.user_id
          })
          console.log('userrrr',user);
          if(!Boolean(user)){
            this.usuarios.push(usu)
          }
        })
       });
    }
    addUserToSorteo(userId: string) {
      const index = this.usuariosParaAnadirAlPartido.indexOf(userId);

      if (index === -1) {
        // El usuario no está en el array, agregarlo
        this.usuariosParaAnadirAlPartido.push(userId);
      } else {
        // El usuario está en el array, quitarlo
        this.usuariosParaAnadirAlPartido.splice(index, 1);
      }
      //console.log('usuariosPartido', this.usuariosParaAnadirAlPartido);
    }

    onSubmit() {
      this.usuariosParaAnadirAlPartido.forEach(userId => {
        // Verifica si el usuario ya está en el array
        if (this.isUsuarioAlreadyAdded(userId)) {
          //console.log('Agregando usuario con Id:', userId);
          debugger
          //llamada al servicio
          this.service.addUserMatch(userId, this.partido).subscribe(data => {
            console.log("Usuario agregado a partido correctamente", data);
            this.closedModal();
            this.snackBar.open('Usuario añadido a partido', 'Cerrar', {
            duration: 5000,
          });
          });
          // Agrega el usuario al array solo si aún no está presente
          this.usuariosParaAnadirAlPartido.push(userId);
        }
      });
    }

    // Función para verificar si el usuario ya está en el array
    isUsuarioAlreadyAdded(userId: string): boolean {
      return this.usuariosParaAnadirAlPartido.includes(userId);
    }


      closedModal(): void {
          this.dialogRef.close();
      }
      getUsuariosPartido(idPartido:string){
        this.service.getUsuariosPartido(idPartido).subscribe(data =>{
          this.usuariosYaInscritos = data;
          console.log('fecha sorteo',this.usuariosYaInscritos );
          this.getUsers();
        });
      }
      // deleteUserInscrito(userId: string){
      //   const index = this.usuariosYaInscritos.findIndex(user => user.user_id === userId);
      //   console.log('user delete', index)
      //   if (index !== -1) {
      //     // El usuario está en el array, quitarlo
      //     this.usuariosYaInscritos.splice(index, 1);
      //     this.getUsers();
      //   }
      // }
      deleteUserInscrito(userId:string,partidoId:Partido){

        this.service.deleteUserMatch(userId,partidoId).subscribe(data =>{
          console.log('delete user',data);
          this.getUsuariosPartido(this.partido.id);
        })

      }

}
