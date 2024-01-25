import { Component, OnInit } from '@angular/core';
import { LoginUserService } from '../../../login-user.service';
import { Observable, Subscriber } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pdf } from '../../../componentes/archivos-pdf/pdf';

@Component({
  selector: 'app-subir-entradas',
  templateUrl: './subir-entradas.component.html',
  styleUrl: './subir-entradas.component.css'
})
export class SubirEntradasComponent {
  public form: FormGroup;
  private b64: String = "";
  pdf:Pdf = new Pdf();
  
  constructor(private userservice: LoginUserService, private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      titulo:[''],
      fecha:[''],
      entradasPdf:[]
    });
  }

  send(){
    this.pdf.tituloPartido = this.form.value.titulo;
    this.pdf.fechaPartido = this.form.value.fecha;
    console.log(this.pdf)
    this.userservice.subirTickets(this.pdf).subscribe(data=>{
      alert("Entradas subidas con exito")
      window.location.reload()
    }, error=> alert("Error al subir las entradas"));
  }

  subirArchivo(event: any): any{
    
    const file:File = (event.target.files as FileList)[0];

    const obserbable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    })
  
    obserbable.subscribe((base64) => {
      this.b64 = new String(base64).valueOf();

      this.pdf = new Pdf();
      this.pdf.file = "" + this.b64;
    })

  }

  readFile(file:File, subscriber: Subscriber<any>){
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

  color = "#8f8989" //grey
  onFocus() {
    this.color = "#3f51b5"//blue
  }
  onBlur() {
    this.color = "#8f8989"
  }
}
