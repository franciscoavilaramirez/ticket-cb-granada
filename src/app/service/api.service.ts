import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../modelo/usuario';
import { Partido } from '../modelo/partido';

import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Pdf } from '../modelo/pdf';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }
  apiUrl = environment.apiUrl

  //Partidos cuya fecha sea posterior a la actual
  //Cada partido tiene un campo extra que indica si quedan entradas disponibles (stockEntradas)
  getProximosPartidos() {
    return this.http.get<Partido[]>(this.apiUrl + 'getProximosPartidos');
  }
  //Ids de los partidos donde tengo entrada
  getMisPartidosIds(userId: number): Observable<number[]> {
    return this.http.get<number[]>(this.apiUrl + 'getMisPartidosIds/'+userId);
  }

  asignarEntrada(idUsuario:number, idPartido:number) {
    return this.http.post(this.apiUrl + 'saveUsuarioPartido/'+idUsuario+'/'+idPartido, {});
  }
  desasignarEntrada(idUsuario:number, idPartido:number) {
    return this.http.delete(this.apiUrl + 'deleteUsuarioFromPartido/'+idUsuario+'/'+idPartido, {});
  }

  getEntradaBase64(idUsuario:number, idPartido:number): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(this.apiUrl + 'enviarEntrada/'+idUsuario+'/'+idPartido,{ headers, responseType: 'text'});
  }

  subirTickets(pdf: Pdf): Observable<object>{
    return this.http.post(this.apiUrl + 'crearPartidoConEntradas', pdf);
  }
  getUsers(){
    return this.http.get<Usuario[]>(this.apiUrl + 'getAllUsers');
  }


  insertLogin(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl+'addUser', usuario);
  }

  // updateUser(usuario: Usuario): Observable<Usuario>{
  //   return this.http.put<Usuario>(`${this.apiUrl+'modificarUsuario'}/${usuario.id}`,usuario);
  // }
  updateUser(usuarioId: string,usuario:any){
    return this.http.put<Usuario>(`${this.apiUrl+'modificarUsuario'}/${usuarioId}`,usuario);
  }
  deleteUser(user: string) {
    return this.http.delete<Usuario>(`${this.apiUrl+'borrarUsuario'}/${user}`);
  }

  Login(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl+'Login', usuario);
  }

  getPartidos(){
    return this.http.get<Partido[]>(this.apiUrl + 'getPartidos');
  }

  getUsuariosPartido(idPartido: number){
    return this.http.get<Usuario[]>(`${this.apiUrl + 'getUsuariosPartido'}/${idPartido}`);
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

  addUserMatch(usuarioId: number | undefined,partidoId: number){
    return this.http.post<Usuario>(`${this.apiUrl+'saveUsuarioPartido'}/${usuarioId}/${partidoId}`,null);
  }
  // updateMatch(partido: Partido): Observable<Partido> {
  //   return this.http.put<Partido>(`${this.apiUrl + 'modificarPartido'}/${partido.id}`, partido);
  // }
  updateMatch(partido: any){
    return this.http.put<Partido>(`${this.apiUrl + 'modificarPartido'}/${partido.id}`, partido);
  }
  deleteMatch(partido: Partido): Observable<Partido> {
    return this.http.delete<Partido>(`${this.apiUrl + 'borrarPartido'}/${partido.id}`);
  }
  deleteUserMatch(usuarioId: number | undefined,partidoId: Partido) {
    return this.http.delete<Usuario>(`${this.apiUrl + 'deleteUsuarioFromPartido'}/${usuarioId}/${partidoId.id}`);
  }
  // getNextMatch(){
  //   return this.http.get<Partido[]>(this.apiUrl + 'getProximosPartidos');
  // }
  
  getUsuarioById(usuarioId: number){
    return this.http.get<Usuario>(this.apiUrl + 'userById/'+usuarioId);
  }

  checkPasswords(usuarioId: number, password: string){
    return this.http.get<Boolean>(this.apiUrl + 'checkPasswords/'+usuarioId+'/'+password);
  }

  modifyUser(usuario: Usuario): Observable<Partido> {
    return this.http.put<Partido>(`${this.apiUrl+'modificarUsuario'}/${usuario.id}`, usuario);
  }

}
