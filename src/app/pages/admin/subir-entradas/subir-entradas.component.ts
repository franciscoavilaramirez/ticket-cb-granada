import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable, Subscriber, min } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pdf } from '../../../modelo/pdf';
import { ApiService } from '../../../service/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Partido } from '../../../modelo/partido';

@Component({
  selector: 'app-subir-entradas',
  templateUrl: './subir-entradas.component.html',
  styleUrl: './subir-entradas.component.css'
})
export class SubirEntradasComponent {
  public form: FormGroup;
  private b64: String = "";
  pdf: Pdf = new Pdf();
  entradas: any//FormData = new FormData();
  noFiles = true
  @Output() actualizacionProximosPartidos: EventEmitter<any> = new EventEmitter<void>();


  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<SubirEntradasComponent>) { }

  ngOnInit() {
    let fechaActual = this.getFechaActual()
    this.form = this.formBuilder.group({
      granada: [{ value:'Granada', disabled: true }],
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
    //console.log("partido", partido)
    //console.log(this.entradas)
    let form = new FormData()
    form.append('partido', JSON.stringify(partido))
    form.append('entradasPdf', this.entradas)
    this.apiService.subirPartido(form).subscribe({
      next: (r) => {console.log("partido creado",r),
           this.actualizacionProximosPartidos.emit();
           //console.log('Evento emitido desde SubirEntradasComponent');

           this.dialogRef.close();
      },
      error: (error) => {
        console.error("Error al crear el partido:", error);
      },
      complete: () => {
        //console.log('Solicitud de creación de partido completada.');
      }
    }
    );

    // this.apiService.getProximosPartidos().subscribe(data => {
    //   console.log('dataaaa subir partido',data)
    // })
    //console.log('Emitiendo un nuevo partido');
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
