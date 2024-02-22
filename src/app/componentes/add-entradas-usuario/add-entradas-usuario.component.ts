import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HomeComponent } from '../../pages/home/home.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Usuario } from '../../modelo/usuario';
import { Partido } from '../../modelo/partido';

@Component({
  selector: 'app-add-entradas-usuario',
  templateUrl: './add-entradas-usuario.component.html',
  styleUrl: './add-entradas-usuario.component.scss'
})
export class AddEntradasUsuarioComponent implements OnInit {

  idUsuario:number;
addTicketsForm: FormGroup;
numEntradas: number;

constructor(private apiService:ApiService,public dialogRef: MatDialogRef<HomeComponent>,
            @Inject(MAT_DIALOG_DATA) public partidoId: Partido,
            @Inject(MAT_DIALOG_DATA) public usuario: Usuario){}


  ngOnInit(): void {
    this.createAddTicketsForm();

    this.idUsuario = this.getUsuarioId();
    console.log('userid desde local storage',this.idUsuario) // user_id almacenado en local storage
    this.apiService.getProximosPartidos().subscribe(proximosPartidos =>{
      console.log('proximos partidos',proximosPartidos);
      if (proximosPartidos != null) {
        this.partidoId = proximosPartidos[0]
        console.log('partidoooooooID',this.partidoId.id);
      }
    });
  }

createAddTicketsForm(){
  this.addTicketsForm = new FormGroup({
    numeroTickets: new FormControl(''),
  })
}
getUsuarioId(): number {
  let userStr = localStorage.getItem('user');
  if (userStr == null)
    return -1
  else
    return JSON.parse(userStr).user_id
}
onSubmit(){
  const bodyResponse = this.addTicketsForm.value;
  this.numEntradas = bodyResponse.numeroTickets;
  //console.log('bodyResponse',bodyResponse)
  console.log('numEntradas',this.numEntradas)

  this.apiService.getDescargarEntradasAdi(this.idUsuario,this.partidoId.id,this.numEntradas).subscribe(data =>{
  console.log('dataaaaa',data);
  });
}
  closedModal(): void {
    this.dialogRef.close();
    //this.apiService.getProximosPartidos();
}
}
