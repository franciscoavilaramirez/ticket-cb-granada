import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Input() isAdmin = false
  constructor(private translate: TranslateService) { }

  user: any;
  ngOnInit(): void {
    let userStr = localStorage.getItem('user');
    if (userStr != null) {
      let user = JSON.parse(userStr);
      this.isAdmin = user.isAdmin
      console.log(user)
      console.log("isAdmin: " + user.isAdmin)
    }
  }
  
  activeLang = 'es';
  cambiarIdioma(event: any) {
    //console.log('Valor seleccionado:', event.target.value);

    const lang = event.target.value;
    this.activeLang = lang;
    this.translate.use(lang);
  }


}
