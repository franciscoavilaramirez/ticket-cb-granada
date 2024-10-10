import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../modelo/usuario';
import { Partido } from '../../modelo/partido';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';
import Swal from 'sweetalert2';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterPipe } from '../../pipes/filter.pipe';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    TranslateModule, 
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    FilterPipe,
    MatButtonModule
  ],
})
export class AddUserComponent {

usuariosYaInscritos: Usuario[];
usuarios: Usuario[];
usuariosParaAnadirAlPartido: Array<number | undefined>= [];
filterPost = '';

  constructor(private apiService:ApiService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdminHomeComponent>,@Inject(MAT_DIALOG_DATA) public partido: Partido,
    public snackBar: MatSnackBar
    ){}

    ngOnInit(){
     this.getUsuariosPartido(this.partido.id);

    }
    getUsers(){
      this.apiService.getUsers().subscribe(data=>{
        this.usuarios = [];
        data.forEach(usu =>{
          const user = this.usuariosYaInscritos?.find(usuInscrito =>{
           return  usu.user_id === usuInscrito.user_id
          })
          if(!Boolean(user)){
            this.usuarios.push(usu)
          }
        })
       });
    }
    addUserToSorteo(userId: number | undefined) {
      const index = this.usuariosParaAnadirAlPartido.indexOf(userId);

      if (index === -1) {
        // El usuario no está en el array, agregarlo
        this.usuariosParaAnadirAlPartido.push(userId);
      } else {
        // El usuario está en el array, quitarlo
        this.usuariosParaAnadirAlPartido.splice(index, 1);
      }
    }

    onSubmit() {
      this.usuariosParaAnadirAlPartido.forEach(userId => {
        // Verifica si el usuario ya está en el array
        if (this.isUsuarioAlreadyAdded(userId)) {
          //llamada al servicio
          this.apiService.addUserMatch(userId, this.partido.id).subscribe(success => {
            //this.closedModal();
            console.log('success',success)
            this.partido.stockEntradas--;

            this.getUsuariosPartido(this.partido.id);
            if(success)
              this.snackBar.open('Usuario añadido a partido', 'Cerrar', {
                duration: 5000,
              });
            else
              this.snackBar.open('No quedan entradas para el partido', 'Cerrar', {
                duration: 5000,
              });
          });
          // Agrega el usuario al array solo si aún no está presente
          this.usuariosParaAnadirAlPartido.push(userId);
        }
      });
    }

    // Función para verificar si el usuario ya está en el array
    isUsuarioAlreadyAdded(userId: number | undefined): boolean {
      return this.usuariosParaAnadirAlPartido.includes(userId);
    }


    closedModal(): void {
        this.dialogRef.close();
        this.apiService.getProximosPartidos();

    }
    getUsuariosPartido(idPartido:number){
      this.apiService.getUsuariosPartido(idPartido).subscribe(data =>{
        this.usuariosYaInscritos = data;
        this.getUsers();
      });
    }

    deleteUserInscrito(userId:number | undefined ,partidoId:Partido){
      this.apiService.deleteUserMatch(userId,partidoId).subscribe(data =>{
        this.partido.stockEntradas++;
        this.getUsuariosPartido(this.partido.id);
      })

    }
}
