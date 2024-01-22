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
  public formArchivos: FormGroup;
  private b64: String = "";
  pdf:Pdf = new Pdf();

  constructor(private userservice: LoginUserService, private fb:FormBuilder) { }

  ngOnInit() {
    this.formArchivos = this.createMyForm();
  }


  private createMyForm():FormGroup{
    return this.fb.group({
      titulo:[''],
      fecha:[''],
      archivosSubir:[]
    });
  }

  send(){
    this.pdf.tituloPartido = this.formArchivos.value.titulo;
    this.pdf.fechaPartido = this.formArchivos.value.fecha;
    console.log(this.pdf)
    this.userservice.subirTickets(this.pdf).subscribe(data=>{
      alert("Tickets repartidos a las usuarios con exito")
    }, error=> alert("Error al repartir los tickets a los usuaroios"));
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
}
