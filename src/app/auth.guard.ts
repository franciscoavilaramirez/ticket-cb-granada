import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from './service/token.service';
import { UserService } from './service/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from './modelo/usuario';


@Injectable({

  providedIn: 'root'

})

export class AuthGuard implements CanActivate {


  constructor( private router: Router, private tokenService: TokenService,private userService: UserService) {}

   canActivate():boolean {
    //debugger;
    const token = localStorage.getItem('token');
    if (token) {
      //console.log('Token decodificado:' );
      const jwt = new JwtHelperService();
      //debugger;
      const tokenDecoded = jwt.decodeToken(token); // Pasamos la variable 'token' aquí
      console.log('Token decodificado:', tokenDecoded);
      this.userService.setUserData(tokenDecoded.usuario);
    } else {
      console.log('No hay token en el localStorage');
    }

    const userLocalStorage = this.userService.getUserData();
    const isLoggedIn = Boolean(userLocalStorage);

    if (!isLoggedIn) {
      console.log('dentro del auth-guard')
      return false;
      this.router.navigate(['/login']);


    }
    return true;
  }



}

// export const authGuard: CanActivateFn = () => {
//   const authService = inject(ApiService);
//   const router = inject(Router);
//   return authService.isAuthenticated$(). pipe(
//     take(1),
//     tap((isLoggedIn) =>
//       !isLoggedIn ? router.navigate(['/login']) : true

//     )
//   );


//   };
