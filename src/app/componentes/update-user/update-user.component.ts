import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Usuario } from '../../modelo/usuario';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';
import { ApiService } from '../../service/api.service';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent {

updateUserForm:FormGroup;
usuarios!: Usuario[];

constructor(private apiService:ApiService,public dialog: MatDialog,
            public dialogRef: MatDialogRef<AdminHomeComponent>,
            @Inject(MAT_DIALOG_DATA) public userModify: Usuario){
              this.createFormUpdateUser();
            }

ngOnInit(){
  this.getUsers();
}

createFormUpdateUser(){
  this.updateUserForm = new FormGroup({
    nombre: new FormControl(this.userModify.nombre),
    apellidos: new FormControl(this.userModify.apellidos),
    email: new FormControl(this.userModify.email,Validators.email),
    //isAdmin: new FormControl(Boolean(this.userModify.is_admin)),
    user_id:new FormControl(this.userModify.id)

  });
}
getUsers(){
  this.apiService.getUsers().subscribe(data =>{
    this.usuarios = data
    console.log('Usuarios desde update-users', this.usuarios);
  });
}

onSubmit(){
  if(this.updateUserForm.valid){

    const bodyResponse = this.updateUserForm.value;
    this.userModify.nombre = bodyResponse.nombre;
    this.userModify.apellidos = bodyResponse.apellidos;
    this.userModify.email = bodyResponse.email
    console.log("bodyResponse",bodyResponse);
    this.apiService.updateUser(bodyResponse.user_id,this.userModify).subscribe((data) =>{
      console.log('usuario update',data)
      this.closedModal();
      this.getUsers();
    });

  }
}

// onSubmit(){
//   if(this.updateUserForm.valid){

//      this.usuarios = this.updateUserForm.value;
//     debugger
//     console.log("bodyResponse",this.usuarios);
//     this.apiService.updateUser().subscribe(() =>{
//       debugger
//       this.closedModal();
//       this.getUsers();
//     });

//   }
// }

  closedModal(): void {
    this.dialogRef.close();
  }
}
