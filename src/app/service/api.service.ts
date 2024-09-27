import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../modelo/usuario';
import { Partido } from '../modelo/partido';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Pdf } from '../modelo/pdf';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FileInfo } from '../modelo/FileInfo';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private idiomaActual = new BehaviorSubject<string>('es');
  idioma$ = this.idiomaActual.asObservable();

  constructor(private http:HttpClient, private translate: TranslateService, private router: Router) {
    this.translate.setDefaultLang('es'); // idioma por defecto
   }

  apiUrl = environment.apiUrl
  //Partidos cuya fecha sea posterior a la actual
  //Cada partido tiene un campo extra que indica si quedan entradas disponibles (stockEntradas)

  cambiarIdioma(idioma: string) {
    this.idiomaActual.next(idioma);
    this.translate.use(idioma);
  }
  getProximosPartidos() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')

    });
    //return this.http.get<Usuario[]>(`${this.apiUrl + 'getAllUsers'}`,{headers:reqHeader});
    return this.http.get<Partido[]>(`${this.apiUrl + 'getProximosPartidos'}`,{headers:reqHeader});
  }
  //Ids de los partidos donde tengo entrada
  getMisPartidosIds(userId: number) {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')

    });
    return this.http.get<number[]>(`${this.apiUrl + 'getMisPartidosIds/'+userId}`,{headers:reqHeader});
  }

  asignarEntrada(idUsuario:number, idPartido:number) {
    return this.http.post(this.apiUrl + 'saveUsuarioPartido/'+idUsuario+'/'+idPartido, {});
  }
  desasignarEntrada(idUsuario:number, idPartido:number) {
    return this.http.delete(this.apiUrl + 'deleteUsuarioFromPartido/'+idUsuario+'/'+idPartido, {});
  }

  getUsers(){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
      //(`${this.apiUrl+'modificarUsuario'}/${usuarioId}`,usuario);

    });
    //return this.http.get<Usuario[]>(this.apiUrl + 'getAllUsers');
    return this.http.get<Usuario[]>(`${this.apiUrl + 'getAllUsers'}`,{headers:reqHeader});

  }

  insertLogin(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl+'addUser', usuario);
  }

  subirPartido(partidoForm: any):Observable<Partido> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post<Partido>(`${this.apiUrl}subirPartido`, partidoForm, { headers: reqHeader });

    //Angel estas de lineas de abajo no me han funcionado
    //return this.http.post<any>(`${this.apiUrl+'subirPartido'}/${partidoForm}`,{headers:reqHeader});
    //return this.http.post<any>(`${this.apiUrl+'subirPartido', partidoForm}`,{headers:reqHeader});
    //return this.http.post<any>(this.apiUrl+'subirPartido', partidoForm);
  }

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
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get<Partido[]>(`${this.apiUrl + 'getPartidos'}`,{headers:reqHeader});
  }

  getUsuariosPartido(idPartido: number){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get<Usuario[]>(`${this.apiUrl + 'getUsuariosPartido'}/${idPartido}`,{headers:reqHeader});
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

  updateMatch(partido: any){
    return this.http.put<Partido>(`${this.apiUrl + 'modificarPartido'}/${partido.id}`, partido);
  }
  deleteMatch(partido: Partido): Observable<Partido> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.delete<Partido>(`${this.apiUrl + 'borrarPartido'}/${partido.id}`,{headers:reqHeader});
  }
  deleteUserMatch(usuarioId: number | undefined,partidoId: Partido) {
    return this.http.delete<Usuario>(`${this.apiUrl + 'deleteUsuarioFromPartido'}/${usuarioId}/${partidoId.id}`);
  }

  getUsuarioById(usuarioId: number){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get<Usuario>(`${this.apiUrl + 'userById/'+usuarioId}`,{headers:reqHeader});
  }

  checkPasswords(usuarioId: string | undefined, password: string){
    return this.http.get<Boolean>(this.apiUrl + 'checkPasswords/'+usuarioId+'/'+password);
  }

  modifyUser(usuario: Usuario): Observable<Partido> {
    return this.http.put<Partido>(`${this.apiUrl+'modificarUsuario'}/${usuario.id}`, usuario);
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
      'Authorization': 'Bearer ' + localStorage.getItem('token')

    });
    //return this.http.get<Usuario[]>(`${this.apiUrl + 'getAllUsers'}`,{headers:reqHeader});
    //return this.http.get<Partido[]>(`${this.apiUrl + 'getProximosPartidos'}`,{headers:reqHeader});
    return this.http.get<Partido[]>(`${this.apiUrl + 'getPartidosAnteriores'}`,{headers:reqHeader});
  }
  getPartidosInscritos(idUsuario:number) {
    return this.http.get<Partido[]>(this.apiUrl + 'listarPartidosUsuario/' + idUsuario);
  }
  // getEntradasExtra(idUsuario:number, idPartido:number, nEntarda:number) {
  //   return this.http.get<any[]>(this.apiUrl + 'descargarEntradasAdicionales/'+idUsuario+'/'+idPartido+'/'+nEntarda)
  // }
  getEntrada(idUsuario:number, idPartido:number) {
    return this.http.get<FileInfo[]>(this.apiUrl + 'descargarEntrada/'+idUsuario+'/'+idPartido)
  }
  getProximosPartidosDisponibles() {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get<Partido[]>(`${this.apiUrl + 'getProximosPartidosDisponibles'}`,{headers:reqHeader});
  }
  getEntradasExtra(idUsuario:number, idPartido:number, nEntarda:number) {
    return this.http.get<FileInfo[]>(this.apiUrl + 'descargarEntradasAdicionales/'+idUsuario+'/'+idPartido+'/'+nEntarda)
  }


}
