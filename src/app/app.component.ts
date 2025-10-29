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
    translate.addLangs(['es', 'en']);
    const storedLang = localStorage.getItem('lang');
    const browserLang = navigator.language || navigator.languages[0] || 'es';
    const shortLang = browserLang.split('-')[0];
    const selectedLang = storedLang || (['es', 'en'].includes(shortLang) ? shortLang : 'es');

    translate.setDefaultLang('es');
    translate.use(selectedLang);
  }

  router: any;
  title = 'ticket-cb-granada';

  

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

}
