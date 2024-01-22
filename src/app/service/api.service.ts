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
    return this.http.get<Partido[]>(this.apiUrl + 'getProximosPartidos');
  }
  //Ids de los partidos donde tengo entrada
  getMisPartidosIds(userId: number): Observable<number[]> {
    return this.http.get<number[]>(this.apiUrl + 'getMisPartidosIds/'+1); // getMisPartidosIds/{user_id}
  }

  asignarEntrada(idUsuario:number, idPartido:number) { //saveUsuarioPartido/{userID}/{partidoId}
    return this.http.post(this.apiUrl + 'saveUsuarioPartido/'+idUsuario+'/'+idPartido, {});
  }
  desasignarEntrada(idUsuario:number, idPartido:number) {
    return this.http.delete(this.apiUrl + 'deleteUsuarioFromPartido/'+idUsuario+'/'+idPartido, {});
  }

  getEntradaBase64(idUsuario:number, idPartido:number): Observable<any> { //enviarEntrada/{userID}/{partidoId}
    return this.http.get<any>(this.apiUrl + 'enviarEntrada/'+idUsuario+'/'+idPartido, {});
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
