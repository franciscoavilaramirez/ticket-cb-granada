import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../service/api.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-habilitar-entradas',
  templateUrl: './habilitar-entradas.component.html',
  styleUrl: './habilitar-entradas.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    TranslateModule, 
    MatIconModule
  ],
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
    //let fechaActual = this.getFechaActual()
    this.enableTicketsForm = new FormGroup({
      numero: new FormControl(''),
      dias: new FormControl(''),
    });
  }
  onSubmit(){
    if(this.enableTicketsForm.valid){
      const bodyResponse = this.enableTicketsForm.value;
      
      // this.apiService.updateMatch(bodyResponse).subscribe(data =>{
      //   console.log('update partido',data);
      //   this.closedModal();
      // });
    }
  }

  // getFechaActual() {
  //   let fecha = new Date()
  //   let mes:any = fecha.getMonth() + 1
  //   let dia:any = fecha.getDate()
  //   let hora:any = fecha.getHours()
  //   let minutos:any = fecha.getMinutes()

  //   if(mes < 10) mes = '0'+mes
  //   if(dia < 10) dia = '0'+dia
  //   if(hora < 10) hora = '0'+hora
  //   if(minutos < 10) minutos = '0'+minutos

  //   return fecha.getFullYear()+"-"+mes+"-"+dia+"T"+hora+":"+minutos
  // }
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
