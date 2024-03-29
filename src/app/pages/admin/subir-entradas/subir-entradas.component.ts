import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber, min } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pdf } from '../../../modelo/pdf';
import { ApiService } from '../../../service/api.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subir-entradas',
  templateUrl: './subir-entradas.component.html',
  styleUrl: './subir-entradas.component.css'
})
export class SubirEntradasComponent {
  public form: FormGroup;
  private b64: String = "";
  pdf: Pdf = new Pdf();

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<SubirEntradasComponent>) { }

  ngOnInit() {
    let fechaActual = this.getFechaActual()
    this.form = this.formBuilder.group({
      granada: [{ value:'Granada', disabled: true }],
      titulo: [''],
      fecha: [''],
      fechaPublicacion: fechaActual,
      entradasPdf: []
    });
  }

  send() {
    this.pdf.tituloPartido = this.form.value.titulo;
    this.pdf.fechaPartido = this.form.value.fecha;
    this.pdf.fechaPublicacion = this.form.value.fechaPublicacion
    console.log("Pdf: ", this.pdf)
    console.log("Form: ", this.form.value)

    this.apiService.subirTickets(this.pdf).subscribe({
      next: () => {
        alert("Entradas subidas con exito")
        this.dialogRef.close()
      },
      error: () => alert("Error al subir las entradas")
    });
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
      // this.pdf.file = "" + this.b64;
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
    let hora:any = fecha.getHours()
    let minutos:any = fecha.getMinutes()

    if(mes < 10) mes = '0'+mes 
    if(dia < 10) dia = '0'+dia
    if(hora < 10) hora = '0'+hora
    if(minutos < 10) minutos = '0'+minutos
    
    return fecha.getFullYear()+"-"+mes+"-"+dia+"T"+hora+":"+minutos
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
