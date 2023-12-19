import { Component, OnInit } from '@angular/core';
import { LoginUserService } from '../../login-user.service';
import { Observable, Subscriber } from 'rxjs';
import { Pdf } from './pdf';

@Component({
  selector: 'app-archivos-pdf',
  templateUrl: './archivos-pdf.component.html',
  styleUrls: ['./archivos-pdf.component.css']
})
export class ArchivosPDFComponent implements OnInit {

  private b64: String = "";
  pdf:Pdf = new Pdf();

  constructor(private userservice: LoginUserService) { }

  ngOnInit() {
  }

  subirArchivo(event: any): any{
    
    const file:File = (event.target.files as FileList)[0];

    const obserbable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    })
  
    obserbable.subscribe((base64) => {
      this.b64 = new String(base64).valueOf();

      this.pdf = new Pdf();
      this.pdf.id = 0;
      this.pdf.pdfbase = "" + this.b64;
      this.pdf.titulo = "";
      this.pdf.fechaPartido = "";
      this.pdf.id_user = 0;
      this.pdf.assigned = false;
      
      this.userservice.subirTickets(this.pdf).subscribe(data=>{
        alert("Tickets repartidos a las usuarios con exito")
      }, error=> alert("Error al repartir los tickets a los usuaroios"));
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
