import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../service/service.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {

  updateUserForm:FormGroup;


constructor(private service:ServiceService){}

createFormUpdateUser(){
  this.updateUserForm = new FormGroup({
    nombre: new FormControl(""),
    email: new FormControl("",Validators.email),
    apellido: new FormControl("")

  });
}


onSubmit(){
  if(this.updateUserForm.valid){
    const nombre = this.updateUserForm.get("nombre")?.value;
    const email = this.updateUserForm.get("email")?.value;
    const apellido = this.updateUserForm.get("apellido")?.value;

    //const contraseña = this.loginForm.get("contraseña")?.value;
    console.log("nombre", nombre,"email",email);

    this.bodyResponse = {

      nombre:nombre,
      email:email,
      apellido: apellido,
      isAdmin: false

    }
    this.service.insertLogin(this.bodyResponse).subscribe(data => {
      console.log("insert", data);
    });

  }
}

}
