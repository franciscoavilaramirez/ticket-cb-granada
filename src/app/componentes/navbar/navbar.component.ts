import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../service/user.service';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    TranslateModule,
    CommonModule,
    RouterLink,
    FormsModule
  ]
})
export class NavbarComponent implements OnInit {

  isAdmin = false;
  usuario: any;
  activeLang: string = 'es';
  menuAbierto: boolean = false;

  constructor(
    private translate: TranslateService,
    public userService: UserService,
    public apiService: ApiService
  ) { }

  ngOnInit(): void {
    const userData = this.userService.getUserData();
    if (userData) this.isAdmin = userData.isAdmin;

    const savedLang = localStorage.getItem('lang');
    const currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'es';
    this.activeLang = savedLang || currentLang;

    this.translate.use(this.activeLang);
    this.apiService.cambiarIdioma(this.activeLang);
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  cambiarIdioma(event: Event): void {
    const lang = (event.target as HTMLSelectElement).value;
    this.activeLang = lang;
    this.translate.use(lang);
    this.apiService.cambiarIdioma(lang);
    localStorage.setItem('lang', lang);
  }
}
