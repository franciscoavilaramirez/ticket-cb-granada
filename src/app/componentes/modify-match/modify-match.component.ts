import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../service/api.service';
import { Partido } from '../../modelo/partido';

@Component({
  selector: 'app-modify-match',
  templateUrl: './modify-match.component.html',
  styleUrl: './modify-match.component.scss'
})
export class ModifyMatchComponent {

  updateMatchForm:FormGroup;
  partido!: Partido[];

  constructor(private apiService:ApiService,public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdminHomeComponent>,
    @Inject(MAT_DIALOG_DATA) public matchModify: Partido,private translate: TranslateService){
      this.createFormUpdateMatch();
  }
  ngOnInit(){
    this.getPartidos();
  }

  createFormUpdateMatch(){
    this.updateMatchForm = new FormGroup({

      equipoVisitante: new FormControl(this.matchModify.equipoVisitante),
      fechaPartido: new FormControl(this.matchModify.fechaPartido),
      fechaPublicacion: new FormControl(this.matchModify.fechaPublicacion.split('T')[0]),
      id:new FormControl(this.matchModify.id),
    });
  }
  getPartidos(){
    this.apiService.getPartidos().subscribe(data =>{
    });
  }
  onSubmit(){
    if(this.updateMatchForm.valid){
      const bodyResponse: Partido = this.updateMatchForm.value;

      // Aquí separamos la fecha, eliminando la hora si existe
      //const fechaPartidoSoloFecha = bodyResponse.fechaPublicacion.split('T')[0];
      bodyResponse.fechaPublicacion = bodyResponse.fechaPublicacion + this.getHoraActual()

      // Volvemos a asignar la fecha sin hora y añadimos la hora actual
     //bodyResponse.fechaPublicacion = fechaPartidoSoloFecha + this.getHoraActual();

      this.apiService.updateMatch(bodyResponse).subscribe(data =>{
        console.log('update partido',data);
        this.closedModal();
      });

    }else(console.log('NO se actualiza partido'));
  }
  closedModal(): void {
    this.dialogRef.close();
  }
  getHoraActual(){
    let fecha = new Date()
    let hora:any = fecha.getHours()
    let minutos:any = fecha.getMinutes()

    if(hora < 10) hora = '0'+hora
    if(minutos < 10) minutos = '0'+minutos

    return "T"+ hora +":"+minutos
  }
}
