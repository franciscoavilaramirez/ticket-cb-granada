import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../modelo/usuario';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PerfilComponent } from '../../pages/perfil/perfil.component';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrl: './edit-password.component.scss'
})
export class EditPasswordComponent {

  editPassword: FormGroup;

  constructor(private service: ApiService, public dialog: MatDialog, private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PerfilComponent>,
    @Inject(MAT_DIALOG_DATA) public userModify: Usuario) { }

  ngOnInit() {
    this.editPassword = this.formBuilder.group({
      contrasenaActual: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[@#$%^&+=*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$")]],
      contrasenaNueva: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[@#$%^&+=*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$")]],
      contrasenaRepetida: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[@#$%^&+=*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$")]]
    }, { validator: this.checkPasswordsMatch });

      console.log("id usuario edit: "+ this.userModify.id)
      console.log("usuario edit: "+ JSON.stringify(this.userModify))

    }

  checkPasswordsMatch(group: FormGroup) {
    let passControl = group.get('contrasenaNueva');
    let confirmPassControl = group.get('contrasenaRepetida');

    if (passControl && confirmPassControl) {
      let pass = passControl.value;
      let confirmPass = confirmPassControl.value;
      return pass === confirmPass ? null : { notSame: true }
    }
    return { notSame: true };
  }

  checkPasswords() {
    console.log("contraseña actual: " + this.editPassword.get("contrasenaActual")?.value);
    console.log("passwird: " + this.userModify.id);
    if (this.userModify.id != null) {
      this.service.checkPasswords(this.userModify.id, this.editPassword.get("contrasenaActual")?.value).subscribe(response => {
        if (response == true) {
          console.log("contraseña correcta");
          let usuario: Usuario = this.userModify;
          usuario.password = this.editPassword.get("contrasenaNueva")?.value;
          this.service.modifyUser(usuario).subscribe(() => { })
          this.closedModal();
        } else {
          alert("La contraseña actual no existe");
        }
      })
    }
    else {
      alert("Id usuario indefinido");
    }
  }



  closedModal() {
    this.dialogRef.close();
  }


}


