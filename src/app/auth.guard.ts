import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from './service/token.service';
import { UserService } from './service/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService,
    private jwtHelper: JwtHelperService
  ) { }

  canActivate(): boolean {
    const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/email'];

    const currentUrl = this.router.url.split('?')[0];
    if (publicRoutes.includes(currentUrl)) {
      return true;
    }

    const token = this.tokenService.token;

    if (!token) {
      this.handleInvalidSession('No se encontró ninguna sesión activa');
      return false;
    }

    try {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.handleInvalidSession('Tiempo de sesión expirado');
        return false;
      }

      const tokenDecoded = this.jwtHelper.decodeToken(token);

      if (tokenDecoded?.usuario) {
        this.userService.setUserData(tokenDecoded.usuario);
      } else {
        this.handleInvalidSession('Sesión no válida');
        return false;
      }

      return true;

    } catch (error) {
      console.error('Error al verificar token:', error);
      this.handleInvalidSession('Error al verificar la sesión');
      return false;
    }
  }

  private handleInvalidSession(message: string) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    Swal.fire({
      title: message,
      icon: 'info',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#e20074',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-swal-confirm'
      }
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }
}
