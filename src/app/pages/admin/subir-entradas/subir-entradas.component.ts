import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable, Subscriber, min } from 'rxjs';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pdf } from '../../../modelo/pdf';
import { ApiService } from '../../../service/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Partido } from '../../../modelo/partido';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subir-entradas',
  templateUrl: './subir-entradas.component.html',
  styleUrl: './subir-entradas.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule
  ]
})
export class SubirEntradasComponent {
  public form: FormGroup;
  private b64: String = "";
  pdf: Pdf = new Pdf();
  entradas: File//FormData = new FormData();
  noFiles = true
  @Output() actualizacionProximosPartidos: EventEmitter<any> = new EventEmitter<void>();


  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<SubirEntradasComponent>) { }

  ngOnInit() {
    let fechaActual = this.getFechaActual()
    this.form = this.formBuilder.group({
      granada: [{ value:' CB Granada', disabled: true }],
      equipoVisitante: [''],
      fechaPartido: [''],
      fechaPublicacion: fechaActual,
    });
  }

  uploadPdfFile(event: any) {
    this.entradas = event.target.files[0];
    this.noFiles = false
  }
  subirPartido() {
    let partido: Partido = this.form.value;

    partido.fechaPublicacion = partido.fechaPublicacion + this.getHoraActual()
    let form = new FormData()
    form.append('partido', JSON.stringify(partido))
    form.append('entradasPdf', this.entradas)
    this.apiService.subirPartido(form).subscribe({
      next: (r) => {
           this.actualizacionProximosPartidos.emit();
           this.dialogRef.close();
      },
      error: (error) => {
        Swal.fire("No se ha podido generar el partido", "", "error");
        console.error("Error al crear el partido:", error);
      },
      complete: () => {
      }
    }
    );
    this.dialogRef.close();
  }

  subirArchivo(event: any): any {
    const file: File = (event.target.files as FileList)[0];
    const obserbable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    })
    obserbable.subscribe((base64) => {
      this.b64 = new String(base64).valueOf();
      let firstHalf = this.b64.substring(0, this.b64.length/2)
      let secondHalf = this.b64.substring(this.b64.length/2)

      this.pdf = new Pdf();
      this.pdf.file1 = firstHalf
      this.pdf.file2 = secondHalf
    })

  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {

      subscriber.next(fileReader.result);
      subscriber.complete();
    }
    fileReader.onerror = () => {
      subscriber.error();
      subscriber.complete();
    }
  }

  getFechaActual() {
    let fecha = new Date()
    let mes:any = fecha.getMonth() + 1
    let dia:any = fecha.getDate()
    if(mes < 10) mes = '0'+mes
    if(dia < 10) dia = '0'+dia

    return fecha.getFullYear()+"-"+mes+"-"+dia
  }
  getHoraActual(){
    let fecha = new Date()
    let hora:any = fecha.getHours()
    let minutos:any = fecha.getMinutes()
    if(hora < 10) hora = '0'+hora
    if(minutos < 10) minutos = '0'+minutos

    return "T"+ hora +":"+minutos
  }

  color = "lightgray" //grey
  inputValue = ''
  onFocus() {
    this.color = "black"//"#3f51b5"//blue
  }
  onBlur() {
    if(this.inputValue == '')
      this.color = "lightgray" //grey
    else
      this.color = "black"
  }
}
