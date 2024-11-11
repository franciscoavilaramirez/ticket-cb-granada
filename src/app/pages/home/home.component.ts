import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Partido } from '../../modelo/partido';
import { MatDialog } from '@angular/material/dialog';
import { AddEntradasUsuarioComponent } from '../../componentes/add-entradas-usuario/add-entradas-usuario.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private apiService: ApiService, private renderer: Renderer2,public dialog: MatDialog,private userService:UserService, private cdr: ChangeDetectorRef) {

  }
  idioma: string = 'es'; // valor inicial por defecto
  idUsuario: number
  partidos: Partido[]
  misPartidosIds: number[]
  primerPartido: Partido
  filterPost = '';
  partidosFuturos: Partido[] =[];
  spinnerShow = false;
  color: ThemePalette = "accent";
  infoUserNoMatch: boolean = false;


  ngOnInit() {

    this.spinnerShow = true
    this.apiService.idioma$.subscribe((nuevoIdioma: string) => {
      this.idioma = nuevoIdioma;
    });
    this.idUsuario = this.getUsuarioId()
    this.apiService.getMisPartidosIds(this.idUsuario).subscribe(misPartidosIds => {
      this.misPartidosIds = misPartidosIds
      this.apiService.getProximosPartidos().subscribe(proximosPartidos => {
        if (proximosPartidos != null) {
          this.primerPartido = proximosPartidos[0]
          this.spinnerShow = false;
          if (this.misPartidosIds?.includes(this.primerPartido.id))
            this.primerPartido.tengoEntrada = true
          else
            this.primerPartido.tengoEntrada = false

          proximosPartidos.splice(0, 1) //quitamos el primer partido para mostrarlo mas grande como siguiente partido
          this.partidos = proximosPartidos //el resto de partidos que se mostraran abajo mas pequeños
          this.partidos.forEach(partido => {
            if (this.misPartidosIds?.includes(partido.id))
              partido.tengoEntrada = true;
            else
              partido.tengoEntrada = false;
          })
        }
        if (!this.primerPartido) {
          this.infoUserNoMatch = true;
          this.spinnerShow = false;
          this.cdr.detectChanges();// Forzamos para que detecte cambios y asegurarnos de que muestra el mensaje al usuario
          console.log('primer partido',this.primerPartido) 
        }else {this.infoUserNoMatch = false
          console.log('info user a false') 

        }
      });
    });
    this.getPartidosFuturos();
  }

  apuntarse(idPartido: number) {
    this.apiService.asignarEntrada(this.idUsuario, idPartido).subscribe(response => {
      if (response) {
        if (this.primerPartido.id == idPartido)
          this.primerPartido.tengoEntrada = true
        else {
          this.partidos.forEach(partido => {
            if (partido.id == idPartido)
              partido.tengoEntrada = true;
          });
        }
      } else {
          alert("No quedan entradas")
      }
    })

  }
  devolver(idPartido: number) {
    this.apiService.desasignarEntrada(this.idUsuario, idPartido).subscribe(() => {
      if (this.primerPartido.id == idPartido) {
        this.primerPartido.tengoEntrada = false
      }
      else {
        this.partidos.forEach(partido => {
          if (partido.id == idPartido) {
            partido.tengoEntrada = false;
          }
        });
      }
    })
  }
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
        link.download = 'Granada - ' + nombrePartido + '.pdf';
        link.click();
        window.URL.revokeObjectURL(url);

      })

    });
  }

  getUsuarioId(): number {
    const userId = this.userService.getUserData();
     return userId.id;
  }

  openAddTicketsUser() {
    const dialog = this.dialog.open(AddEntradasUsuarioComponent,{
      width:'30vw',
      height:'60vh'
    });
    dialog.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  getPartidosFuturos(){
    this.apiService.getProximosPartidosDisponibles().subscribe(partidosFuturos =>{
      this.partidosFuturos = partidosFuturos;
    });
  }

  descargarVarias(idPartido: number, nombrePartido: string, contentType = '') {
    this.apiService.getEntradasExtra(2, 1, 2).subscribe(entradaPdf => {
      entradaPdf.forEach(file => {
        //console.log("aaaaaaaaa "+file.data + file.fileName)
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
        link.download = 'Granada - ' + nombrePartido + '.pdf';
        link.click();
        window.URL.revokeObjectURL(url);

      })
    });
  }
}
