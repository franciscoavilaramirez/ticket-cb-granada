import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../service/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private apiService: ApiService,
        private translate: TranslateService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 403) {
                    Swal.fire({
                        icon: 'warning',
                        title: this.translate.instant('errores.sesionExpiradaTitulo'),
                        text: this.translate.instant('errores.sesionExpiradaTexto'),
                        confirmButtonText: this.translate.instant('errores.sesionExpiradaAceptar'),
                        confirmButtonColor: '#e20074'
                    }).then(() => {
                        this.apiService.logout();
                        this.router.navigate(['/login']);
                    });
                }

                else if (error.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: this.translate.instant('errores.sinPermisosTitulo'),
                        text: this.translate.instant('errores.sinPermisosTexto'),
                        confirmButtonText: this.translate.instant('errores.sinPermisosAceptar'),
                        confirmButtonColor: '#e20074'
                    }).then(() => {
                        this.router.navigate(['/']);
                    });
                }

                return throwError(() => error);
            })
        );
    }
}
