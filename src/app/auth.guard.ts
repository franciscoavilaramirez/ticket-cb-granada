import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from './service/token.service';
import { UserService } from './service/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';



@Injectable({

  providedIn: 'root'

})

export class AuthGuard implements CanActivate {


  constructor( private router: Router, private tokenService: TokenService,private userService: UserService,private jwtHelper: JwtHelperService) {}

  canActivate(): boolean {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    // Si existe el token, verificamos su validez
    if (token) {

      // Verificar si el token ha expirado
      if (this.jwtHelper.isTokenExpired(token)) {

        Swal.fire("Tiempo de sesión expirado", "", "info");

        this.router.navigate(['/login']);
        return false;
      }

      // Decodificar el token si no ha expirado
      const tokenDecoded = this.jwtHelper.decodeToken(token);
      
      //Fecha en la que el expira el token
      const expirationDate = new Date(tokenDecoded.exp * 1000);
      const timeString = expirationDate.toLocaleTimeString();
      
      
      // Configurar los datos del usuario en el UserService
      this.userService.setUserData(tokenDecoded.usuario);

    } else {
      
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si hay datos del usuario en el UserService
    const userLocalStorage = this.userService.getUserData();
    const isLoggedIn = Boolean(userLocalStorage);

    // Si no hay usuario logueado, redirigir al login
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    // Si todo está bien, permitir el acceso a la ruta
    return true;
  }

  //  canActivate():boolean {
  //   //debugger;
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     //console.log('Token decodificado:' );
  //     const jwt = new JwtHelperService();
  //     //debugger;
  //     const tokenDecoded = jwt.decodeToken(token); // Pasamos la variable 'token' aquí
  //     console.log('Token decodificado:', tokenDecoded);
  //     this.userService.setUserData(tokenDecoded.usuario);
  //     console.log('setUserData:', tokenDecoded.usuario);

  //   } else {
  //     console.log('No hay token en el localStorage');
  //   }


  //   const userLocalStorage = this.userService.getUserData();
  //   const isLoggedIn = Boolean(userLocalStorage);

  //   if (!isLoggedIn) {
  //     console.log('dentro del auth-guard')
  //     return false;
  //     this.router.navigate(['/login']);
  //   }
  //   return true;
  // }
}
