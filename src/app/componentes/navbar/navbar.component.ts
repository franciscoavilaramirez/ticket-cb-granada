import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  constructor(private translate: TranslateService, public userService: UserService) { }

  isAdmin = false
  ngOnInit(): void {
    this.isAdmin = this.userService.getMyUser().isAdmin
  }

  activeLang = 'es';
  cambiarIdioma(event: any) {
    //console.log('Valor seleccionado:', event.target.value);

    const lang = event.target.value;
    this.activeLang = lang;
    this.translate.use(lang);
  }


}
