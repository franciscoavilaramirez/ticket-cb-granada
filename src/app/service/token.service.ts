import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly jwtHelper = inject(JwtHelperService);
  public token: string;
  constructor(private userService: UserService) { }

  // tokenConfig(){
  //   const token = localStorage.getItem('token');
  //   const jwt = new JwtHelperService();
  //   const tokenDecoded = jwt.decodeToken('token');
  //   console.log('tokennnnnnnn',tokenDecoded);
  //   this.userService.setUserData(tokenDecoded);
  // }

  tokenConfig():Promise<boolean> {
    const promiseToken = new Promise<boolean>((resolve, reject) => {
      const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
      const jwt = new JwtHelperService();
      const tokenDecoded = jwt.decodeToken(token); // Pasamos la variable 'token' aquí


      if (tokenDecoded && tokenDecoded.usuario) {
        this.userService.setUserData(tokenDecoded.usuario); // Solo pasa los datos del usuario
      } else {
        
      }


      this.userService.setUserData(tokenDecoded);
      resolve(true);
    } else {
      reject(false);
    }
    });
    return promiseToken;
  }
}
