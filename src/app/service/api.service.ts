import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../modelo/usuarios';
import { Partido } from '../modelo/partidos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  apiUrl = 'http://localhost:9191/cbgranada-api/v1/';

  //Partidos cuya fecha sea posterior a la actual
  //Cada partido tiene un campo extra que indica si quedan entradas disponibles
  getProximosPartidos(): Observable<Partido[]> {
    //TODO: url api
    return new Observable<Partido[]>;
  }
  //Ids de los partidos donde tengo entrada
  getMisPartidosIds(userId: number): Observable<number[]> {
    //TODO: url api
    return new Observable<number[]>;
  }

  asignarEntrada(idUsuario:number, idPartido:number) {
    //TODO: url api
  }
  desasignarEntrada(idUsuario:number, idPartido:number) {
    //TODO: url api
  }

  getEntradaBase64(idPartido:number, idUsuario:number): Observable<string> {
    //TODO: url api
    return new Observable<string>;
  }

  getUsers(){
    return this.http.get<Usuario[]>(this.apiUrl + 'getAllUsers');
  }


  insertLogin(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl+'addUser', usuario);
  }

  modifyUser(usuario: Usuario): Observable<Usuario>{   
    return this.http.put<Usuario>(`${this.apiUrl+'modificarUsuario'}/${usuario.id}`,usuario);
  }
  deleteUser(user: Usuario): Observable<Usuario> { 
    return this.http.delete<Usuario>(`${this.apiUrl+'borrarUsuario'}/${user.id}`);
  }

  Login(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl+'Login', usuario);
  }

  getPartidos(){
    return this.http.get<Partido[]>(this.apiUrl + 'getPartidos');
  }
  getUsuariosSorteo(fecha: string){ 
    return this.http.get<Usuario[]>(`${this.apiUrl+'getUsuariosSorteo'}/${fecha}`);
  }

  addPartido(partido: Partido): Observable<Partido> {
    return this.http.post<Partido>(this.apiUrl + 'addPartido', partido);
  }

  modifyPartido(partido: Partido): Observable<Partido> { 
    return this.http.put<Partido>(`${this.apiUrl+'modificarPartido'}/${partido.id}`, partido);
  }

  deletePartido(partido: Partido): Observable<Partido> {
    return this.http.delete<Partido>(`${this.apiUrl+'borrarPartido'}/${partido.id}`);
  }

}
