import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from './service/token.service';


@Injectable({

  providedIn: 'root'

})

export class AuthGuard implements CanActivate {


  constructor( private router: Router, private tokenService: TokenService) {}

  canActivate(): boolean {
    //debugger;
    const token = localStorage.getItem('token');  // Leer el token fake de localStorage
    const userLocalStorage = localStorage.getItem('user');
    const isLoggedIn = Boolean(userLocalStorage);

    if (!isLoggedIn) {
      console.log('dentro del auth-guard')
      this.router.navigate(['/login']);
      return false;
    }
    this.tokenService.tokenConfig();
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
