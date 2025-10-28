import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Usuario } from '../../../modelo/usuario';
import { ApiService } from '../../../service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../../../componentes/update-user/update-user.component';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { RegisterAdminDialogComponent } from '../../../componentes/register-admin-dialog/register-admin-dialog.component';
import { UserService } from '../../../service/user.service';
import { Partido } from '../../../modelo/partido';
import { MatchAssistUserComponent } from '../../../componentes/match-assist-user/match-assist-user.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  constructor(private router: Router, public apiService: ApiService, public dialog: MatDialog, public userService: UserService, private translate: TranslateService) {

  }
  @ViewChild('TABLE') table!: ElementRef;
  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'apellidos', 'email', 'partidos', 'botones'];
  filterPost = '';
  myId: number;
  partidosInscritos: Partido[] = [];
  usuariosMostrar: Usuario[] = [];
  cantidadPorPagina = 10;
  opcionesDeCantidades = [10, 20, 30];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  usuariosDataSource = new MatTableDataSource<Usuario>([]); // Inicializar el dataSource
  filterTerm: string = '';


  ngOnInit() {
    const userData = this.userService.getUserData();
    if (!userData.isAdmin){
      this.router.navigate(['/home']);
    };
    this.getUsers()
  }
  // Método para aplicar el filtro
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usuariosDataSource.filter = filterValue.trim().toLowerCase();  // Filtrar los datos
  }
  ngAfterViewInit() {
    this.usuariosDataSource.paginator = this.paginator;
  }

  getUsers() {
    this.apiService.getUsers().subscribe(data => {
      this.usuarios = data;
      this.usuariosDataSource.data = data;
      this.usuariosDataSource.data = this.usuarios;  // Asignar los datos al dataSource

    });
  }
  paginar(event: any) {
    const inicio = event.pageIndex * event.pageSize;
    const fin = inicio + event.pageSize;
    this.usuariosDataSource.data = this.usuarios.slice(inicio, fin);
  }

  openRegistrarUsuario() {
    this.dialog.open(RegisterAdminDialogComponent, {
      width: '40vw',
      height: '95vh',
    }).afterClosed().subscribe(() => {
      this.getUsers()
    });
  }
  openDialog(usuarioAny: any) {

    let usuario: Usuario = {
      id: usuarioAny.user_id,
      nombre: usuarioAny.nombre,
      apellidos: usuarioAny.apellidos,
      email: usuarioAny.email
    }
    const dialog = this.dialog.open(UpdateUserComponent, {
      data: usuario,
      width: '25vw',
      height: '90vh'
    });

    dialog.afterClosed().subscribe(result => {
      this.getUsers();
    });
  }
  getPartidosInscritosUser(idUsuario: number) {
    this.apiService.getPartidosInscritos(idUsuario).subscribe(data => {
      this.partidosInscritos = data;
      const dialog = this.dialog.open(MatchAssistUserComponent, {
        data: this.partidosInscritos,
        width: '30vw',
        height: '75vh',
      });
      dialog.afterClosed().subscribe(result => {
      });
    });
  }

  deleteUser(userId: string): void {
    Swal.fire({
      title: this.translate.instant('usuarios.eliminarTitulo'),
      html: `
      <div style="font-size:15px;color:#555;margin-top:6px;">
        ${this.translate.instant('usuarios.eliminarDescripcion')}
      </div>
    `,
      icon: 'warning',
      iconColor: '#e11010',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('usuarios.eliminarConfirmar'),
      cancelButtonText: this.translate.instant('usuarios.cancelar'),
      background: '#ffffff',
      color: '#333',
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-html',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel'
      },
      showClass: { popup: 'swal2-show' },
      hideClass: { popup: 'swal2-hide' }
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteUser(userId).subscribe(() => {
          Swal.fire({
            title: this.translate.instant('usuarios.eliminadoTitulo'),
            text: this.translate.instant('usuarios.eliminadoTexto'),
            icon: 'success',
            confirmButtonText: this.translate.instant('usuarios.aceptar'),
            background: '#ffffff',
            color: '#333',
            customClass: {
              popup: 'custom-swal-popup',
              confirmButton: 'custom-swal-confirm'
            }
          }).then(() => {
            this.getUsers();
          });
        }, () => {
          Swal.fire({
            title: this.translate.instant('usuarios.errorTitulo'),
            text: this.translate.instant('usuarios.errorTexto'),
            icon: 'error',
            confirmButtonText: this.translate.instant('usuarios.aceptar'),
            background: '#ffffff',
            color: '#333',
            customClass: {
              popup: 'custom-swal-popup',
              confirmButton: 'custom-swal-confirm'
            }
          });
        });
      } else {
        Swal.close();
      }
    });
  }
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.usuarios.map(usuario => ({
      Nombre: usuario.nombre,
      Apellidos: usuario.apellidos,
      Email: usuario.email,
      PartidosAsistidos: usuario.partidosAsistidos
    })

    ));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Listado_Usuarios');
    /* save to file */
    XLSX.writeFile(wb, 'Listado_Usuarios.xlsx');
  }
}
