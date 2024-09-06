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


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  constructor(public apiService: ApiService, public dialog: MatDialog, public userService: UserService) {

   }
  @ViewChild('TABLE') table!: ElementRef;
  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'apellidos', 'email','partidos', 'botones'];
  filterPost = '';
  myId: number;
  partidosInscritos: Partido[] = [];
  usuariosMostrar: Usuario[] = [];
  cantidadPorPagina = 10;
  opcionesDeCantidades = [10,20,30];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  usuariosDataSource = new MatTableDataSource<Usuario>([]); // Inicializar el dataSource
  filterTerm: string = '';


  ngOnInit() {
    this.getUsers()
    this.myId = this.userService.getMyUser().user_id
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
      height:'95vh',
    }).afterClosed().subscribe(()=>{
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
  getPartidosInscritosUser(idUsuario: number){
    this.apiService.getPartidosInscritos(idUsuario).subscribe(data =>{
      this.partidosInscritos = data;
      console.log('partidos inscritos',this.partidosInscritos)
      const dialog = this.dialog.open(MatchAssistUserComponent,{
        data: this.partidosInscritos,
        width:'30vw',
        height:'75vh',
      });
      dialog.afterClosed().subscribe(result => {
      });
    });
    }

  deleteUser(userId: string): void {
    Swal.fire({
      title: '¿Seguro que desea eliminar este usuario?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar',
      confirmButtonColor: 'red',
      denyButtonColor: 'grey',
    }).then((response) => {
      if (response.isConfirmed) {
        this.apiService.deleteUser(userId).subscribe((success)=>{
            Swal.fire("Usuario Eliminado", "", "success");
            this.getUsers()
        });
      }
    });
  }
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    ws["!ref"] = ws["!ref"]?.replace("A","B").replace("E","D") //Excel empieza en columna B (descarta la columna ID que solo es un indice, no corresponden a bbdd), y termina en D (E contiene la columna de los botones en la tabla)
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'Listado_Usuarios.xlsx');
  }
}
