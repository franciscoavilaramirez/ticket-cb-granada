import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Usuario } from '../../../modelo/usuario';
import { ApiService } from '../../../service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../../../componentes/update-user/update-user.component';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { RegisterAdminDialogComponent } from '../../../componentes/register-admin-dialog/register-admin-dialog.component';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  constructor(public apiService: ApiService, public dialog: MatDialog, public userService: UserService) { }

  @ViewChild('TABLE') table!: ElementRef;
  usuarios: Usuario[]
  displayedColumns: string[] = ['id', 'nombre', 'apellidos', 'email','partidos', 'botones'];
  filterPost = '';
  myId: number;

  ngOnInit() {
    this.getUsers()
    this.myId = this.userService.getMyUser().user_id
  }

  openRegistrarUsuario() {
    this.dialog.open(RegisterAdminDialogComponent, {
      width: '50vw'
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
    console.log('usuarioAny', usuarioAny, 'usuario', usuario);
    const dialog = this.dialog.open(UpdateUserComponent, {
      data: usuario,
      width: '25vw',
      height: '75vh'
    });

    dialog.afterClosed().subscribe(result => {
      this.getUsers();
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

  getUsers() {
    this.apiService.getUsers().subscribe(data => {
      this.usuarios = data
      console.log('Usuarios', this.usuarios);
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
