import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../service/service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HomeComponent } from '../home/home.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Usuario } from '../../modelo/empleados';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent {

  updateUserForm:FormGroup;




constructor(private service:ServiceService,public dialog: MatDialog,
            public dialogRef: MatDialogRef<HomeComponent>,
            @Inject(MAT_DIALOG_DATA) public userModify: Usuario){
              this.createFormUpdateUser();
            }

ngOnInit(){
  this.service.getUsers();

}


createFormUpdateUser(){
  this.updateUserForm = new FormGroup({
    nombre: new FormControl(this.userModify.nombre),
    apellido: new FormControl(this.userModify.apellido),
    email: new FormControl(this.userModify.email,Validators.email),
    isAdmin: new FormControl(Boolean(this.userModify.is_admin)),
    userId:new FormControl(this.userModify.user_id)

  });
}


onSubmit(){
  if(this.updateUserForm.valid){

    const bodyResponse = this.updateUserForm.value;
    console.log("bodyResponse",bodyResponse);
    this.service.modifyUser(bodyResponse).subscribe(data =>{
      //alert("Usuario modificado correctamente");
      this.closedModal();
    });

  }
}

  closedModal(): void {
    this.dialogRef.close();
  }
}
