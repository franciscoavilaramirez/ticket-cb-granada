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
  getProximosPartidos(): Observable<Partido[]> {
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

  addUserMatch(usuarioId: string,partido: Partido){
    return this.http.post<Usuario>(`${this.apiUrl+'saveUsuarioSorteo'}/${usuarioId}/${partido.fechaPartido}`,null);
  }
}