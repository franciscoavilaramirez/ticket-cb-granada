import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Usuario } from '../../modelo/usuario';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss',
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
    MatDialogModule
  ],
})
export class UpdateUserComponent {

updateUserForm:FormGroup;
usuarios!: Usuario[];
hidePassword: { [key: string]: boolean } = {
  contrasenaNueva: true,
  contrasenaRepetida: true
};


constructor(private apiService:ApiService,public dialog: MatDialog,
            public dialogRef: MatDialogRef<AdminHomeComponent>,
            @Inject(MAT_DIALOG_DATA) public userModify: Usuario,private formBuilder: FormBuilder){
              this.createFormUpdateUser();
            }

ngOnInit(){
  this.getUsers();
}
clickEvent(field: string, event: MouseEvent) {
  if (this.hidePassword.hasOwnProperty(field)) {
    this.hidePassword[field] = !this.hidePassword[field];
  }
  event.stopPropagation();
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
