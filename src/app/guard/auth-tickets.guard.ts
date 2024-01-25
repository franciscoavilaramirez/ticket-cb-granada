import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthTicketsGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();

    if (user !== null) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/tickets']);
      } else {
        this.router.navigate(['/home']);
      }
      return false;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
