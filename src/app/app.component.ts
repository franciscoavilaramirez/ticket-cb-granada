import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TokenService } from './service/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ticket-cb-granada';
  private routerEventsSub?: Subscription;

  constructor(
    private translate: TranslateService,
    private tokenService: TokenService,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    translate.addLangs(['es', 'en']);
    const storedLang = localStorage.getItem('lang');
    const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'es';
    const shortLang = (browserLang || 'es').split('-')[0];
    const selectedLang = storedLang || (['es', 'en'].includes(shortLang) ? shortLang : 'es');

    translate.setDefaultLang('es');
    translate.use(selectedLang);
  }

  ngOnInit() {
    this.routerEventsSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkTokenAndRedirect(event.urlAfterRedirects);
        this.routerEventsSub?.unsubscribe();
      }
    });

    try {
      const currentUrl = this.router && (this.router as any).url;
      if (currentUrl) {
        this.checkTokenAndRedirect(currentUrl);
      }
    } catch {
    }
  }

  ngOnDestroy() {
    this.routerEventsSub?.unsubscribe();
  }

  private checkTokenAndRedirect(currentUrl: string) {
    const token = localStorage.getItem('token');
    const path = (currentUrl || '').split('?')[0].split('#')[0];
    const onRootOrLogin = path === '/' || path === '' || path === '/login';

    if (!onRootOrLogin) {
      return;
    }

    if (token) {
      try {
        const expired = this.jwtHelper.isTokenExpired(token);
        if (!expired) {
          this.router.navigate(['/home']);
          return;
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.router.navigate(['/login']).catch(err => console.error(err));
          return;
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
        return;
      }
    } else {
      return;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
