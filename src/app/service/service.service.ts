import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Usuario } from '../modelo/empleados';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }

  //Url = 'https://localhost:3306/BaseDatosEmpleados/infoEmpleados';
  UrlGlobal = 'http://localhost:9191/cbgranada-api/v1/';
  UrlInsertLogin = 'http://localhost:9191/cbgranada-api/v1/addUser';
  UrlDeleteUser = 'http://localhost:9191/cbgranada-api/v1/borrarUsuario';


  getUsers(){
    return this.http.get<Usuario[]>(this.UrlGlobal + 'getAllUsers');
  }
  insertLogin(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.UrlInsertLogin, usuario);
  }
  modifyUser(){

  }
  // deleteUser(id: number){
  //   this.http.delete<Usuario>(`${this.UrlDeleteUser}/${id}`);
  // }

  // deleteUser(email: string){
  //   return this.http.delete<Usuario>(this.UrlGlobal + email,{
  //     observe:'response'
  //   });
  // }
  deleteUser(user: Usuario): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.UrlDeleteUser}/${user.userId}`);
  }

}
