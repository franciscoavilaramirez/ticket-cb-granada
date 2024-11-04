import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../service/user.service';
import { ApiService } from '../../service/api.service';
import { Usuario } from '../../modelo/usuario';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    RouterLink
    // BrowserModule
  ]
})
export class NavbarComponent implements OnInit {

  constructor(private translate: TranslateService, public userService: UserService, public apiService: ApiService) { }

  isAdmin = false
  usuario:any

  ngOnInit(): void {
    //console.log("El idioma actual es: ", this.apiService.getCurrentLenguage());
    const userData = this.userService.getUserData();
  if (userData) {
    this.isAdmin = userData.isAdmin;
  } else {
  }
  }

  cambiarIdioma(event: any) {
    const idiomaSeleccionado = event.target.value;
    this.apiService.cambiarIdioma(idiomaSeleccionado);
  }
  activeLang = 'es';
}
