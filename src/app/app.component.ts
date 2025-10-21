import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TokenService } from './service/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(translate: TranslateService, private tokenService: TokenService) {
    translate.setDefaultLang('es');
    translate.use('es');
  }

  router: any;
  title = 'ticket-cb-granada';

  ngOnInit() {
    if (this.router.url !== '/login') {
      this.tokenService.tokenConfig()
        .catch(() => this.router.navigate(['/login']));
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
