import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }

  Url='enlace de la base de datos';

// getUsuarios(){
//   return this.http.get<Usuario[]>(this.Url);
// }



}
