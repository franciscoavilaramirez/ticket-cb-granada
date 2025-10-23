import { Component, ViewChild, AfterViewInit, ElementRef, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Partido } from '../../../modelo/partido';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Usuario } from '../../../modelo/usuario';
import { UpdateUserComponent } from '../../../componentes/update-user/update-user.component';
import { AddUserComponent } from '../../../componentes/add-user/add-user.component';
import { ModifyMatchComponent } from '../../../componentes/modify-match/modify-match.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../service/api.service';
import { SubirEntradasComponent } from '../subir-entradas/subir-entradas.component';
import { ListUserComponent } from '../../../componentes/list-user/list-user.component';
import { Subscription } from 'rxjs';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements AfterViewInit {
  [x: string]: any;

  constructor(
    private snackBar: MatSnackBar,
    public apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang(this.activeLang);
  }

  partidosFuturos: Partido[] = [];
  misPartidosIds: number[];
  idUsuario: number;
  activeLang = 'es';
  exportCsv = false;
  usuarios!: Usuario[];
  bodyResponse: Usuario;
  partido!: Partido[];
  proximosPartidos!: Partido[];
  usuariosPartido!: Usuario[];
  fechaPartido: string;
  idPartido!: string;
  entradasSobrantes!: any;
  entradas: number;
  partidosPasados: Partido[] = [];
  spinnerShow = true;
  color: ThemePalette = 'accent';
  @ViewChild('TABLE') table!: ElementRef;
  private subscription: Subscription;

  ColumnsInscritos: string[] = ['id', 'nombre', 'apellidos', 'email'];
  displayedColumns: string[] = ['partido', 'fecha', 'usuarios'];
  displayColumns: string[] = ['partido', 'fechaDelPartido', 'editar'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Partido>([]);
  dataSourceFuturos = new MatTableDataSource<Partido>([]);
  filterTermFuturo: string = '';
  filterTerm: string = '';

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  ngOnInit() {
    this.getUsers();
    this.getProximosPartidos();
    this.getPartidosAnteriores();
    this.getPartidosFuturos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public cambiarLenguaje(lang: string) {
    this.activeLang = lang;
    this.translate.use(lang);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterFuture(event: Event): void {
    const filterValue = this.filterTermFuturo;
    this.dataSourceFuturos.filter = filterValue.trim().toLowerCase();
  }

  getUsers() {
    this.apiService.getUsers().subscribe(data => {
      this.usuarios = data;
    });
  }

  deleteUser(userId: string): void {
    this.openConfirmDialog(
      'Eliminar usuario',
      '¿Seguro que deseas eliminar este usuario?',
      'Eliminar',
      'Cancelar',
      () => {
        this.apiService.deleteUser(userId).subscribe(() => {
          this.getUsers();
          this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
            duration: 3000,
          });
        });
      }
    );
  }

  openDialog(usuarioAny: any) {
    let usuario: Usuario = {
      id: usuarioAny.user_id,
      nombre: usuarioAny.nombre,
      apellidos: usuarioAny.apellidos,
      email: usuarioAny.email
    };

    const dialog = this.dialog.open(UpdateUserComponent, {
      data: usuario,
      width: '35vw',
      height: '85vh'
    });
    dialog.afterClosed().subscribe(() => this.getUsers());
  }

  openSubirEntradas() {
    const dialog = this.dialog.open(SubirEntradasComponent, {
      width: '40vw',
      height: '85vh',
      autoFocus: false
    });

    const instance = dialog.componentInstance;
    instance.actualizacionProximosPartidos.subscribe(() => {
      this.spinnerShow = true;
      this.getProximosPartidos();
    });

    dialog.afterClosed().subscribe(() => {
      this.getProximosPartidos();
      this.getPartidosFuturos();
    });
  }

  openAddUser(partido: Partido) {
    const dialog = this.dialog.open(AddUserComponent, {
      data: partido,
      width: '35vw',
      height: '85vh'
    });
    dialog.afterClosed().subscribe(() => this.getProximosPartidos());
  }

  openModifyMatch(partido: Partido) {
    const dialog = this.dialog.open(ModifyMatchComponent, {
      data: partido,
      width: '35vw',
      height: '90vh'
    });
    dialog.afterClosed().subscribe(() => {
      this.getProximosPartidos();
      this.getPartidosFuturos();
    });
  }

  getProximosPartidos() {
    this.apiService.getProximosPartidos().subscribe(data => {
      this.proximosPartidos = data;
      this.spinnerShow = false;
      this.idUsuario = this.getUsuarioId();

      this.apiService.getMisPartidosIds(this.idUsuario).subscribe(misPartidosIds => {
        this.misPartidosIds = misPartidosIds;

        if (this.proximosPartidos) {
          this.proximosPartidos.forEach(partido => {
            partido.tengoEntrada = this.misPartidosIds?.includes(partido.id);
          });
        }
      });
    });
  }

  getUsuariosPartido(idPartido: any) {
    this.apiService.getUsuariosPartido(idPartido).subscribe(data => {
      this.usuariosPartido = data;

      const dialog = this.dialog.open(ListUserComponent, {
        data: this.usuariosPartido,
        width: '35vw',
        height: '75vh'
      });
      dialog.afterClosed().subscribe(() => this.getUsers());
    });
  }

  deleteMatch(partidoId: Partido) {
    this.openConfirmDialog(
      'Eliminar partido',
      '¿Seguro que deseas eliminar este partido?',
      'Eliminar',
      'Cancelar',
      () => {
        this.apiService.deleteMatch(partidoId).subscribe(() => {
          this.getProximosPartidos();
          this.snackBar.open('Partido eliminado correctamente', 'Cerrar', {
            duration: 3000,
          });
        });
      }
    );
  }

  getPartidosAnteriores() {
    this.apiService.getPartidosAnteriores().subscribe(partidosAnteriores => {
      this.partidosPasados = partidosAnteriores;
      this.dataSource.data = this.partidosPasados;
    });
  }

  getUsuarioId(): number {
    const userId = this.userService.getUserData();
    return userId.id;
  }

  devolver(idPartido: number) {
    this.apiService.desasignarEntrada(this.idUsuario, idPartido).subscribe(() => {
      this.proximosPartidos.forEach(partido => {
        if (partido.id == idPartido) {
          partido.tengoEntrada = false;
          partido.stockEntradas++;
        }
      });
      this.getProximosPartidos();
    });
  }

  apuntarse(idPartido: number) {
    this.apiService.asignarEntrada(this.idUsuario, idPartido).subscribe(response => {
      if (response) {
        this.proximosPartidos.forEach(partido => {
          if (partido.id == idPartido) {
            partido.tengoEntrada = true;
            partido.stockEntradas--;
          }
        });
      } else {
        this.snackBar.open('No quedan entradas disponibles', 'Cerrar', {
          duration: 3000,
        });
      }
      this.getProximosPartidos();
    });
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
      });
    });
  }

  getPartidosFuturos() {
    this.apiService.getProximosPartidosDisponibles().subscribe(partidosFuturos => {
      this.partidosFuturos = partidosFuturos;
      this.dataSourceFuturos.data = this.partidosPasados;
    });
  }
  
  openConfirmDialog(
    title: string,
    message: string,
    confirmText: string,
    cancelText: string,
    onConfirm: () => void
  ) {
    this.dialogRef = this.dialog.open(this.confirmDialog, {
      width: '400px',
      data: { title, message, confirmText, cancelText },
      panelClass: 'custom-dialog-container'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) onConfirm();
    });
  }

  closeDialog(result: boolean) {
    this.dialogRef.close(result);
  }
}
