import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileInfo } from '../modelo/fileInfo';
import { Partido } from '../modelo/partido';
import { Usuario } from '../modelo/usuario';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  idiomaActual = new BehaviorSubject<string>('es');
  idioma$ = this.idiomaActual.asObservable();

  constructor(private http:HttpClient, private translate: TranslateService, private router: Router,private tokenService: TokenService) {

  }

  apiUrl = environment.apiUrl

  getCurrentLenguage(){
    return this.idioma$;
  }

  cambiarIdioma(idioma: string) {
    this.idiomaActual.next(idioma);
    this.translate.use(idioma);
  }
  getProximosPartidos() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.get<Partido[]>(`${this.apiUrl + 'getProximosPartidos'}`,{headers:reqHeader});
  }
  //Ids de los partidos donde tengo entrada
  getMisPartidosIds(userId: number) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.get<number[]>(`${this.apiUrl + 'getMisPartidosIds/'+userId}`,{headers:reqHeader});
  }

  asignarEntrada(idUsuario:number, idPartido:number) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.post(this.apiUrl + 'saveUsuarioPartido/'+idUsuario+'/'+idPartido,{},{headers:reqHeader});
  }

  desasignarEntrada(idUsuario:number, idPartido:number) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.delete(this.apiUrl + 'deleteUsuarioFromPartido/'+idUsuario+'/'+idPartido,{headers:reqHeader});
  }

  getUsers(){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.get<Usuario[]>(`${this.apiUrl + 'getAllUsers'}`,{headers:reqHeader});
  }

  insertLogin(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl+'addUser', usuario);
  }

  subirPartido(partidoForm: FormData):Observable<Partido> {
    const reqHeader = new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.post<Partido>(`${this.apiUrl}subirPartido`, partidoForm,{ headers: reqHeader });
  }

  updateUser(usuarioId: number,usuario:any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.put<Usuario>(`${this.apiUrl+'modificarUsuario'}/${usuarioId}`,usuario,{ headers: reqHeader });
  }
  deleteUser(user: string) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
        });
    return this.http.delete<Usuario>(`${this.apiUrl+'borrarUsuario'}/${user}`, { headers: reqHeader });
  }

  Login(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl+'Login', usuario);
  }

  getPartidos(){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.get<Partido[]>(`${this.apiUrl + 'getPartidos'}`,{headers:reqHeader});
  }

  getUsuariosPartido(idPartido: number){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.get<Usuario[]>(`${this.apiUrl + 'getUsuariosPartido'}/${idPartido}`,{headers:reqHeader});
  }

  addPartido(partido: Partido): Observable<Partido> {
    return this.http.post<Partido>(this.apiUrl + 'addPartido', partido);
  }

  // modifyPartido(partido: Partido): Observable<Partido> {
  //   return this.http.put<Partido>(`${this.apiUrl+'modificarPartido'}/${partido.id}`, partido);
  // }

  // deletePartido(partido: Partido): Observable<Partido> {
  //   return this.http.delete<Partido>(`${this.apiUrl+'borrarPartido'}/${partido.id}`);
  // }

  addUserMatch(usuarioId: number | undefined,partidoId: number){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.post<Usuario>(`${this.apiUrl+'saveUsuarioPartido'}/${usuarioId}/${partidoId}`,null,{headers:reqHeader});
  }

  updateMatch(partido: any){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.put<Partido>(`${this.apiUrl + 'modificarPartido'}/${partido.id}`, partido,{headers:reqHeader});
  }
  deleteMatch(partido: Partido): Observable<Partido> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.delete<Partido>(`${this.apiUrl + 'borrarPartido'}/${partido.id}`,{headers:reqHeader});
  }
  deleteUserMatch(usuarioId: number | undefined,partidoId: Partido) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.delete<Usuario>(`${this.apiUrl + 'deleteUsuarioFromPartido'}/${usuarioId}/${partidoId.id}`,{headers:reqHeader});
  }

  getUsuarioById(usuarioId: number){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.get<Usuario>(`${this.apiUrl + 'userById/'+usuarioId}`,{headers:reqHeader});
  }

  checkPasswords(usuarioId: string | number, password: string){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.get<Boolean>(this.apiUrl + 'checkPasswords/'+usuarioId+'/'+password,{headers:reqHeader});
  }

  modifyUser(usuario: Usuario): Observable<Partido> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.put<Partido>(`${this.apiUrl+'modificarUsuario'}/${usuario.id}`, usuario,{headers:reqHeader});
  }
  getEntradasSobrantes(partidoId: number){
    return this.http.get<Partido>(this.apiUrl + 'entradasSobrantes/'+partidoId);
  }
  getDescargarEntradasAdi(usuarioId: number,partidoId: number,numEntradas: number){
    return this.http.get<Boolean>(this.apiUrl + 'descargarEntradasAdicionales/'+ usuarioId + '/' + partidoId + '/' + numEntradas);
  }
  getPartidosAnteriores(){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.get<Partido[]>(`${this.apiUrl + 'getPartidosAnteriores'}`,{headers:reqHeader});
  }
  getPartidosInscritos(idUsuario:number) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.get<Partido[]>(this.apiUrl + 'listarPartidosUsuario/' + idUsuario,{headers:reqHeader});
  }
  // getEntradasExtra(idUsuario:number, idPartido:number, nEntarda:number) {
  //   return this.http.get<any[]>(this.apiUrl + 'descargarEntradasAdicionales/'+idUsuario+'/'+idPartido+'/'+nEntarda)
  // }
  getEntrada(idUsuario:number, idPartido:number) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.get<FileInfo[]>(this.apiUrl + 'descargarEntrada/'+idUsuario+'/'+idPartido,{headers:reqHeader})
  }
  getProximosPartidosDisponibles() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.tokenService.token,
    });
    return this.http.get<Partido[]>(`${this.apiUrl + 'getProximosPartidosDisponibles'}`,{headers:reqHeader});
  }
  getEntradasExtra(idUsuario:number, idPartido:number, nEntarda:number) {
    return this.http.get<FileInfo[]>(this.apiUrl + 'descargarEntradasAdicionales/'+idUsuario+'/'+idPartido+'/'+nEntarda)
  }

}
