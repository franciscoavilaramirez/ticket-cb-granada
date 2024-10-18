import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  router: any;
logout() {

  // borrar usuario del localstorage
  localStorage.removeItem('user');
  // redirigir a la página de inicio
  window.location.href = '/';
}
  title = 'ticket-cb-granada';

  constructor(translate: TranslateService){
    translate.setDefaultLang('es');
    translate.use('es');
  }

}
