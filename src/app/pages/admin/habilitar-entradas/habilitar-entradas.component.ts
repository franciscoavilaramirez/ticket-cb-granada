import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../service/api.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-habilitar-entradas',
  templateUrl: './habilitar-entradas.component.html',
  styleUrl: './habilitar-entradas.component.scss'
})
export class HabilitarEntradasComponent {

  enableTicketsForm: FormGroup;
  color = "lightgray" //grey
  inputValue = ''

  constructor(private apiService: ApiService,  private dialogRef: MatDialogRef<HabilitarEntradasComponent>) { }

  ngOnInit() {
    this.createFormEnableTickets();
  }

  createFormEnableTickets(){
    let fechaActual = this.getFechaActual()
    this.enableTicketsForm = new FormGroup({
      numero: new FormControl(''),
      fechaPublicacion: new FormControl(fechaActual),
    });
  }
  onSubmit(){
    if(this.enableTicketsForm.valid){
      const bodyResponse = this.enableTicketsForm.value;
      console.log("bodyResponse",bodyResponse);
      // this.apiService.updateMatch(bodyResponse).subscribe(data =>{
      //   console.log('update partido',data);
      //   this.closedModal();
      // });
    }
  }

  getFechaActual() {
    let fecha = new Date()
    let mes:any = fecha.getMonth() + 1
    let dia:any = fecha.getDate()
    let hora:any = fecha.getHours()
    let minutos:any = fecha.getMinutes()

    if(mes < 10) mes = '0'+mes
    if(dia < 10) dia = '0'+dia
    if(hora < 10) hora = '0'+hora
    if(minutos < 10) minutos = '0'+minutos

    return fecha.getFullYear()+"-"+mes+"-"+dia+"T"+hora+":"+minutos
  }
  onFocus() {
    this.color = "black"//"#3f51b5"//blue
  }
  onBlur() {
    if(this.inputValue == '')
      this.color = "lightgray" //grey
    else
      this.color = "black"
  }
  closedModal(): void {
    this.dialogRef.close();

}

}
