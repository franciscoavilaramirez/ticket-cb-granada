import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
            @Inject(MAT_DIALOG_DATA) public userModify: Usuario,private formBuilder: FormBuilder){
              this.createFormUpdateUser();
            }

ngOnInit(){
  this.getUsers();
}

createFormUpdateUser(){
  this.updateUserForm = this.formBuilder.group({
    nombre: new FormControl(this.userModify.nombre),
    apellidos: new FormControl(this.userModify.apellidos),
    email: new FormControl(this.userModify.email,Validators.email),
    contrasena: new FormControl('',Validators.pattern("^(?=.*\\d)(?=.*[@#$%^&+=*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$")),
    repiteContrasena: new FormControl('',Validators.pattern("^(?=.*\\d)(?=.*[@#$%^&+=*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$")),
    user_id:new FormControl(this.userModify.id)
  },{validator:this.checkPasswordsMatch}
  );
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
    this.userModify.email = bodyResponse.email;
    this.userModify.password = bodyResponse.contrasena;
    console.log("bodyResponse",bodyResponse);
    this.apiService.updateUser(bodyResponse.user_id,this.userModify).subscribe((data) =>{
      console.log('usuario update',data)
      this.closedModal();
    });

  }
}
checkPasswordsMatch(group: FormGroup) {
  let passControl = group.get('contrasena');
  let confirmPassControl = group.get('repiteContrasena');

  if (passControl && confirmPassControl) {
    let pass = passControl.value;
    let confirmPass = confirmPassControl.value;
    return pass === confirmPass ? null : { notSame: true }
  }
  return { notSame: true };
}
  closedModal(): void {
    this.dialogRef.close();
  }
}
