import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Usuario } from '../modelo/usuario';
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
  UrlUpdatePartido = 'http://localhost:9191/cbgranada-api/v1/modificarPartido';
  UrlLogin = 'http://localhost:9191/cbgranada-api/v1/Login'
  UrlDeletePartido = 'http://localhost:9191/cbgranada-api/v1/borrarPartido';
  UrlGetUsuariosPartido = 'http://localhost:9191/cbgranada-api/v1/getUsuariosPartido';
  UrlAddUserMatch = 'http://localhost:9191/cbgranada-api/v1/saveUsuarioPartido';
  UrlDeleteUserMatch = 'http://localhost:9191/cbgranada-api/v1/deleteUsuarioFromPartido';
  UrlUpdateMatch = 'http://localhost:9191/cbgranada-api/v1/modificarPartido';
  UrlDeleteMatch = 'http://localhost:9191/cbgranada-api/v1/borrarPartido';






  getUsers(){
    return this.http.get<Usuario[]>(this.UrlGlobal + 'getAllUsers');
  }


  insertLogin(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.UrlInsertLogin, usuario);
  }

  modifyUser(usuario: Usuario): Observable<Usuario>{
    return this.http.put<Usuario>(`${this.UrlUpdateUser}/${usuario.user_id}`,usuario);
  }
  deleteUser(user: Usuario): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.UrlDeleteUser}/${user.user_id}`);
  }

  Login(usuario: Usuario): Usuario{
    this.http.post<Usuario>(this.UrlLogin, usuario);
    return new Usuario;
  }

  getPartidos(){
    return this.http.get<Partido[]>(this.UrlGlobal + 'getPartidos');
  }
  getUsuariosPartido(idPartido: string){
    return this.http.get<Usuario[]>(`${this.UrlGetUsuariosPartido}/${idPartido}`);

  }

  addPartido(partido: Partido): Observable<Partido> {
    return this.http.post<Partido>(this.UrlGlobal + 'addPartido', partido);
  }

  modifyPartido(partido: Partido): Observable<Partido> {
    return this.http.put<Partido>(`${this.UrlUpdatePartido}/${partido.id}`, partido);
  }

  deletePartido(partido: Partido): Observable<Partido> {
    return this.http.delete<Partido>(`${this.UrlDeletePartido}/${partido.id}`);
  }
  addUserMatch(usuarioId: string,partidoId: Partido){
    return this.http.post<Usuario>(`${this.UrlAddUserMatch}/${usuarioId}/${partidoId.id}`,null);
  }
  deleteUserMatch(usuarioId: string,partidoId: Partido) {
    return this.http.delete<Usuario>(`${this.UrlDeleteUserMatch}/${usuarioId}/${partidoId.id}`);
  }
  updateMatch(partido: Partido): Observable<Partido> {
    return this.http.put<Partido>(`${this.UrlUpdateMatch}/${partido.id}`, partido);
  }
  deleteMatch(partido: Partido): Observable<Partido> {
    return this.http.delete<Partido>(`${this.UrlDeleteMatch}/${partido.id}`);
  }
  getNextMatch(){
    return this.http.get<Partido[]>(this.UrlGlobal + 'getProximosPartidos');
  }

}
