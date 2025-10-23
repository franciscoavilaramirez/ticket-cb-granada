import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly jwtHelper = inject(JwtHelperService);
  public token: string | null = null;
  constructor(private userService: UserService) { }

  tokenConfig(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');

      if (token) {
        this.token = token;
        const jwt = new JwtHelperService();
        const tokenDecoded = jwt.decodeToken(token);

        if (tokenDecoded && tokenDecoded.usuario) {
          this.userService.setUserData(tokenDecoded.usuario);
        }

        resolve(true);
      } else {
        reject(false);
      }
    });
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

}
