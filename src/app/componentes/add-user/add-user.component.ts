import { Component } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HomeComponent } from '../home/home.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../modelo/usuario';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

  addUserForm: FormGroup;

  constructor(private service:ServiceService,public dialog: MatDialog,
    public dialogRef: MatDialogRef<HomeComponent>,
    ){}

    ngOnInit(){
      this.createFormAddUser();
    }
    createFormAddUser(){
      this.addUserForm = new FormGroup({
        nombre: new FormControl('',Validators.required),
        apellido: new FormControl('',Validators.required),
        email: new FormControl('',Validators.email),

      });
    }
    onSubmit(){
      if(this.addUserForm.valid){

        const bodyResponse: Usuario = this.addUserForm.value;
        console.log("bodyResponse",bodyResponse);
        this.service.modifyUser(bodyResponse).subscribe(data =>{
          this.closedModal();
        });
      }
    }
    closedModal(): void {
        this.dialogRef.close();
    }

}
