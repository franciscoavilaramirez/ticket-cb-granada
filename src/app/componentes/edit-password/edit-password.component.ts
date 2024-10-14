import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Usuario } from '../../modelo/usuario';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PerfilComponent } from '../../pages/perfil/perfil.component';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrl: './edit-password.component.scss',
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
    MatDialogModule,
    MatButtonModule,
  ],
})
export class EditPasswordComponent {

  editPassword: FormGroup;
  hide = signal(true);
  escondido = signal(true);
  hidePassword: { [key: string]: boolean } = {
    actual: true,
    nueva: true,
    repetida: true
  };

  constructor(private service: ApiService, public dialog: MatDialog, private formBuilder: FormBuilder,private matIconModule: MatIconModule,
    public dialogRef: MatDialogRef<PerfilComponent>,
    @Inject(MAT_DIALOG_DATA) public userModify: Usuario) { }

  ngOnInit() {
    this.editPassword = this.formBuilder.group({
      contrasenaActual: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[@#$%^&+=*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$")]],
      contrasenaNueva: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[@#$%^&+=*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$")]],
      contrasenaRepetida: ['', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[@#$%^&+=*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$")]]
    }, { validator: this.checkPasswordsMatch });
    }

    clickEvent(field: string, event: MouseEvent) {
      if (this.hidePassword.hasOwnProperty(field)) {
        this.hidePassword[field] = !this.hidePassword[field];
      }
      event.stopPropagation();
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
    if (this.userModify.id != null) {
      this.service.checkPasswords(this.userModify.id, this.editPassword.get("contrasenaActual")?.value).subscribe(response => {
        if (response == true) {
          let usuario: Usuario = {id: this.userModify.id,
            email: this.userModify.email,
            password: this.userModify.password,
            apellidos: this.userModify.apellidos,
            partidosAsistidos: this.userModify.partidosAsistidos,
            nombre: this.userModify.nombre,
            _admin: this.userModify._admin}

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


