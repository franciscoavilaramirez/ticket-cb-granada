import { Injectable } from '@angular/core';
import { Usuario } from '../modelo/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private userData: Usuario;
private perfilesUsuario: any[];

  constructor() { }

  // getMyUser(): any {
  //   let userStr = localStorage.getItem('user');
  //   if (userStr == null)
  //     return null
  //   else
  //     return JSON.parse(userStr)
  // }

  getUserData(){

    return this.userData;
  }

  getPerfilesUsuario(){
    return this. perfilesUsuario;

  }
  setUserData(usuario:Usuario){
    this.userData = usuario
  }

  setPerfilesUsuario(perfilesUsuario:any[]){
    this.perfilesUsuario = perfilesUsuario
  }



}
