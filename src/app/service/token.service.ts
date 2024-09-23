import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly jwtHelper = inject(JwtHelperService);

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
      //console.log('Token decodificado:' );
      const jwt = new JwtHelperService();
      //debugger;
      const tokenDecoded = jwt.decodeToken(token); // Pasamos la variable 'token' aquí
      console.log('Token decodificado:', tokenDecoded);
      this.userService.setUserData(tokenDecoded);
      resolve(true);
    } else {
      reject(false);
      console.log('No hay token en el localStorage');
    }
    });
    return promiseToken;
  }
}