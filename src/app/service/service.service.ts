import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Usuario } from '../modelo/empleados';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }

  //Url = 'https://localhost:3306/BaseDatosEmpleados/infoEmpleados';
  Url = 'http://localhost:9191/cbgranada-api/v1/getAllUsers';
  getUsers(){
    return this.http.get<Usuario[]>(this.Url);
  }


}
