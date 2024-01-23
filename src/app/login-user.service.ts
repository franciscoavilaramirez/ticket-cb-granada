import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pdf } from './componentes/archivos-pdf/pdf';


@Injectable({
  providedIn: 'root'
})
export class LoginUserService {

  private baseUrlpdf = 'http://localhost:9191/cbgranada-api/v1/crearPartidoConEntradas';
  constructor(private httpClient: HttpClient) { }
  
  subirTickets(pdf: Pdf):Observable<object>{
    return this.httpClient.post(`${this.baseUrlpdf}`, pdf);
  }

}
