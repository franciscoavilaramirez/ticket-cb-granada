import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Usuario } from '../modelo/empleados';
import { Partido } from '../modelo/partidos';
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
  UrlUpdateUser = 'http://localhost:9191/cbgranada-api/v1/modificarUsuario';
  UrlLogin = 'http://localhost:9191/cbgranada-api/v1/Login'


  getUsers(){
    return this.http.get<Usuario[]>(this.UrlGlobal + 'getAllUsers');
  }

  getUserss(partido: Partido){
    return new Partido;
  }

  insertLogin(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.UrlInsertLogin, usuario);
  }
  modifyUser(usuario: Usuario): Observable<Usuario>{
    return this.http.put<Usuario>(`${this.UrlUpdateUser}/${usuario.userId}`,usuario);
  }
  deleteUser(user: Usuario): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.UrlDeleteUser}/${user.userId}`);
  }

  Login(usuario: Usuario): Usuario{
    this.http.post<Usuario>(this.UrlLogin, usuario);
    return new Usuario;
  }

  getPartidos(){
    return  this.http.get<Partido[]>(this.UrlGlobal + 'getPartidos');
  }

}
