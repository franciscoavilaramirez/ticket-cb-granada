import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router: any;
  constructor() { }

  // Inicia sesión con las credenciales del usuario
  login(email: string, password: string): boolean {
    // llamada API para autenticar al usuario
    // suponer que el inicio de sesión siempre es exitoso

    const user = { email, password, isAdmin: false };

    // Guarda el usuario en el localStorage
    localStorage.setItem('user', JSON.stringify(user));

    return true;
  }

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
