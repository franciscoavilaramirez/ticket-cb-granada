import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HomeComponent } from '../../pages/home/home.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Usuario } from '../../modelo/usuario';
import { Partido } from '../../modelo/partido';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-entradas-usuario',
  templateUrl: './add-entradas-usuario.component.html',
  styleUrl: './add-entradas-usuario.component.scss'
})
export class AddEntradasUsuarioComponent implements OnInit {

idUsuario:number;
addTicketsForm: FormGroup;
numEntradas: number;
//acompananteDisable: boolean =  true;
valueChangesSubscription: Subscription | undefined;

constructor(private apiService:ApiService,public dialogRef: MatDialogRef<HomeComponent>,
            @Inject(MAT_DIALOG_DATA) public partidoId: Partido,
            @Inject(MAT_DIALOG_DATA) public usuario: Usuario,
            public snackBar: MatSnackBar){}


  ngOnInit(): void {
    this.createAddTicketsForm();

    this.idUsuario = this.getUsuarioId();
    this.apiService.getProximosPartidos().subscribe(proximosPartidos =>{
      if (proximosPartidos != null) {
        this.partidoId = proximosPartidos[0]
      }
    });
    this.valueChangesSubscription = this.addTicketsForm.get('numeroTickets')?.valueChanges.subscribe(value => {
    });
  }
  ngOnDestroy() {
    // Darse de baja de la suscripción para evitar posibles fugas de memoria
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  createAddTicketsForm(){
    this.addTicketsForm = new FormGroup({
      numeroTickets: new FormControl(1),
    })
  }
  getUsuarioId(): number {
    let userStr = localStorage.getItem('user');
    if (userStr == null)
      return -1
    else
      return JSON.parse(userStr).id
  }

onSubmit(){
  const bodyResponse = this.addTicketsForm.value;
  this.numEntradas = bodyResponse.numeroTickets;
  this.apiService.getDescargarEntradasAdi(this.idUsuario,this.partidoId.id,this.numEntradas).subscribe(entrada =>{
  console.log('Entrada',entrada);
    if(entrada == true ){
      Swal.fire("Entradas adicionales asignadas", "", "success");
    }
    else {
      Swal.fire("No quedan entradas", "", "info");
    }
  });
  this.closedModal();
}

  closedModal(): void {
    this.dialogRef.close();
    //this.apiService.getProximosPartidos();
}
  incrementNumber() {
    const numeroTicketsControl = this.addTicketsForm.get('numeroTickets');
    if (numeroTicketsControl) {
      let currentValue = parseInt(numeroTicketsControl.value);
      if (!isNaN(currentValue)) {
        numeroTicketsControl.setValue(currentValue + 1);
      }
    }
  }
  decrementNumber() {
    const numeroTicketsControl = this.addTicketsForm.get('numeroTickets');
    if (numeroTicketsControl) {
      let currentValue = parseInt(numeroTicketsControl.value);
      if(currentValue >= 1){
        if (!isNaN(currentValue)) {
          numeroTicketsControl.setValue(currentValue - 1);
        }
      }
    }
  }

}
