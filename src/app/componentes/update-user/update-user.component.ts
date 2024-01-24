import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../service/service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Usuario } from '../../modelo/usuario';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent {

updateUserForm:FormGroup;
usuarios!: Usuario[];

constructor(private service:ServiceService,public dialog: MatDialog,
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
    user_id:new FormControl(this.userModify.user_id)

  });
}
getUsers(){
  this.service.getUsers().subscribe(data =>{
    this.usuarios = data
    console.log('Usuarios desde update-users', this.usuarios);
  });
}

onSubmit(){
  if(this.updateUserForm.valid){

    const bodyResponse: Usuario = this.updateUserForm.value;
    console.log("bodyResponse",bodyResponse);
    this.service.modifyUser(bodyResponse).subscribe(data =>{
      this.closedModal();
      this.getUsers();
    });

  }
}

  closedModal(): void {
    this.dialogRef.close();
  }
}
