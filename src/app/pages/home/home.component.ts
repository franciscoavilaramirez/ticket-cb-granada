import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Partido } from '../../modelo/partido';
import { MatDialog } from '@angular/material/dialog';
import { AddEntradasUsuarioComponent } from '../../componentes/add-entradas-usuario/add-entradas-usuario.component';
import { ThemePalette } from '@angular/material/core';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private apiService: ApiService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService
  ) { }

  idioma: string = 'es';
  idUsuario: number;
  partidos: Partido[] = [];
  misPartidosIds: number[] = [];
  primerPartido: Partido;
  filterPost = '';
  partidosFuturos: Partido[] = [];
  spinnerShow = false;
  color: ThemePalette = "accent";
  infoUserNoMatch: boolean = false;

  ngOnInit() {
    this.cargarDatos();

    const userData = this.userService.getUserData();
    if (userData.isAdmin) {
      this.router.navigate(['/admin-home']);
    };
  }

  cargarDatos() {
    this.spinnerShow = true;
    this.apiService.idioma$.subscribe((nuevoIdioma: string) => {
      this.idioma = nuevoIdioma;
    });

    this.idUsuario = this.getUsuarioId();

    this.apiService.getMisPartidosIds(this.idUsuario).subscribe(misPartidosIds => {
      this.misPartidosIds = misPartidosIds;

      this.apiService.getProximosPartidos().subscribe(proximosPartidos => {
        if (proximosPartidos && proximosPartidos.length > 0) {
          this.primerPartido = proximosPartidos[0];
          this.spinnerShow = false;

          // Marcar si tiene entrada
          this.primerPartido.tengoEntrada = this.misPartidosIds.includes(this.primerPartido.id);

          // Quitar el primero de la lista para mostrar aparte
          proximosPartidos.splice(0, 1);
          this.partidos = proximosPartidos.map(p => ({
            ...p,
            tengoEntrada: this.misPartidosIds.includes(p.id)
          }));
        } else {
          this.infoUserNoMatch = true;
          this.spinnerShow = false;
          this.cdr.detectChanges();
        }
      });
    });

    this.getPartidosFuturos();
  }

  apuntarse(idPartido: number) {
    this.apiService.asignarEntrada(this.idUsuario, idPartido).subscribe(response => {
      if (response) {
        this.actualizarPartidoLocal(idPartido, true);
      } else {
        // Usamos ngx-translate para los textos
        const titulo = this.translate.instant('alertas.entradasAgotadasTitulo');
        const texto = this.translate.instant('alertas.entradasAgotadasTexto');
        const confirmar = this.translate.instant('alertas.aceptar');

        Swal.fire({
          title: titulo,
          text: texto,
          icon: 'warning',
          confirmButtonText: confirmar,
          confirmButtonColor: '#36BF98',
          background: '#fff',
          color: '#333',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
      }
    });
  }

  devolver(idPartido: number) {
    this.apiService.desasignarEntrada(this.idUsuario, idPartido).subscribe(() => {
      this.actualizarPartidoLocal(idPartido, false);
      this.getPartidosFuturos();
      this.apiService.getProximosPartidos().subscribe(proximosPartidos => {
        if (proximosPartidos && proximosPartidos.length > 0) {
          this.primerPartido = proximosPartidos[0];
          proximosPartidos.splice(0, 1);
          this.partidos = proximosPartidos.map(p => ({
            ...p,
            tengoEntrada: this.misPartidosIds.includes(p.id)
          }));
          this.cdr.detectChanges();
        }
      });
    });
  }

  private actualizarPartidoLocal(idPartido: number, tengoEntrada: boolean) {
    // Actualiza primer partido
    if (this.primerPartido?.id === idPartido) {
      this.primerPartido.tengoEntrada = tengoEntrada;
    }

    // Actualiza el resto
    this.partidos = this.partidos.map(p =>
      p.id === idPartido ? { ...p, tengoEntrada } : p
    );

    // Actualiza los IDs de usuario
    if (tengoEntrada) {
      if (!this.misPartidosIds.includes(idPartido)) {
        this.misPartidosIds.push(idPartido);
      }
    } else {
      this.misPartidosIds = this.misPartidosIds.filter(id => id !== idPartido);
    }

    // Forzamos detección de cambios en la vista
    this.cdr.detectChanges();
  }

  /**
   * Descarga la entrada en PDF
   */
  descargar(idPartido: number, nombrePartido: string) {
    this.apiService.getEntrada(this.idUsuario, idPartido).subscribe(entradaPdf => {
      entradaPdf.forEach(file => {
        const byteCharacters = atob(file.data);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i));
        }
        const byteArray = new Uint8Array(byteArrays);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Granada - ${nombrePartido}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
    });
  }

  getUsuarioId(): number {
    const userId = this.userService.getUserData();
    return userId.id;
  }

  openAddTicketsUser() {
    const dialog = this.dialog.open(AddEntradasUsuarioComponent, {
      width: '30vw',
      height: '60vh'
    });
    dialog.afterClosed().subscribe(() => {
      this.cargarDatos();
    });
  }

  getPartidosFuturos() {
    this.apiService.getProximosPartidosDisponibles().subscribe(partidosFuturos => {
      this.partidosFuturos = partidosFuturos;
    });
  }

  descargarVarias(idPartido: number, nombrePartido: string) {
    this.apiService.getEntradasExtra(2, 1, 2).subscribe(entradaPdf => {
      entradaPdf.forEach(file => {
        const byteCharacters = atob(file.data);
        const byteArrays = [];

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i));
        }
        const byteArray = new Uint8Array(byteArrays);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Granada - ${nombrePartido}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
    });
  }
}
