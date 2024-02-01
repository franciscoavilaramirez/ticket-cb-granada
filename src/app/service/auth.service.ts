import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router: any;
  constructor() { }

  // Cierra la sesión del usuario
  logout(): void {
    // Elimina el usuario del localStorage
    localStorage.removeItem('user');
    // Redirige a la página de inicio
    this.router.navigate(['/home']);
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    // Si hay un usuario en el localStorage, entonces está autenticado
    return localStorage.getItem('user') !== null;
  }

  // Verifica si el usuario es un administrador
  isAdmin(): boolean {
    const userItem = localStorage.getItem('user');
    if (userItem === null) {
      return false;
    }

    const user = JSON.parse(userItem);
    return user && user.isAdmin;
  }

  // Obtiene el usuario actual
  getUser(): any {
    const userItem = localStorage.getItem('user');
    if (userItem === null) {
      return null;
    }

    return JSON.parse(userItem);
  }
}
