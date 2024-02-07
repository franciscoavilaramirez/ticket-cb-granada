import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() isAdmin = false
  activeLang = 'es';


constructor(private translate: TranslateService){}


  cambiarIdioma(event: any) {
    //console.log('Valor seleccionado:', event.target.value);

    const lang = event.target.value;
    this.activeLang = lang;
    this.translate.use(lang);
  }


}
