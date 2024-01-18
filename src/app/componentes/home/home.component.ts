import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from '../../modelo/usuario';
import { Partido } from '../../modelo/partidos';
import { ServiceService } from './../../service/service.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../update-user/update-user.component';
import Swal from 'sweetalert2';
import { AddUserComponent } from '../add-user/add-user.component';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
[x: string]: any;


  constructor(private snackBar: MatSnackBar,public service: ServiceService, private router: Router,public dialog: MatDialog) {
  }


  hiddenList = false;
  hiddenListUsuariosPartidos = false;
  hide = true;
  exportCsv = false;
  usuarios!: Usuario[];
  bodyResponse: Usuario;
  currentUser: Usuario;
  //partidos!: Partido[];
  partidosFran!: Partido[];
  usuariosPartido!: Usuario[];
  fechaPartido:string;


  @ViewChild('TABLE')table!: ElementRef;
  @ViewChild('TABLEUSUARIOSPARTIDO')tableUsuariosPartido!: ElementRef;

  displayedColumns: string[] = ['no','nombre','apellido','email','botones'];
  ColumnsInscritos: string[] = ['no','nombre','apellido','email'];

  ngOnInit(){
    this.getUsers();
    this.getPartidos();

  }
  getUsers(){
    this.service.getUsers().subscribe(data =>{
      this.usuarios = data
      console.log('Usuarios', this.usuarios);
    });
  }

  deleteUser(user: Usuario): void {

    this.service.deleteUser(user).subscribe(async data => {
      const dataUser = await Swal.fire({
        title: '¿Seguro que desea eliminar este usuario?',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: 'Cancelar',
        confirmButtonColor:'red',
        denyButtonColor:'grey',
      });
      if (dataUser.isConfirmed) {
        Swal.fire("Usuario Eliminado", "", "success");      }
      // else if (dataUser.isDenied) {
      //   Swal.fire("Changes are not saved", "", "info");
      // }
      this.getUsers();
    });
  }

  openSnackBar() {
    this.snackBar.open('Correo enviado satisfactoriamente', 'Cerrar', {
      duration: 3000
    });
  }


  userList(){
    this.hiddenList = true;
    this.exportCsv = true;
  }
  hiddenUserList(){
    this.hiddenList = false;
    this.exportCsv = false;
  }
  usuarioPartidoList(){
    this.hiddenListUsuariosPartidos = !this.hiddenListUsuariosPartidos;
  }

  isAdmin(){
    return this.currentUser.is_admin;
  }

  ExportTOExcel()
{
  const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, 'Listado_Usuarios.xlsx');
}
  openDialog(usuario:Usuario) {
    this.dialog.open(UpdateUserComponent,{
      data: usuario ,
      width:'450px',
      height:'600px'

    });

  }
  openAddUser(partido: Partido) {
    this.dialog.open(AddUserComponent,{
      data: partido,
      width:'450px',
      height:'600px'

    });

  }
  getPartidos(){
    this.service.getPartidos().subscribe(data =>{
      this.partidosFran = data;
      console.log('Partidos',this.partidosFran);
    })
  }
  getUsuariosSorteo(fechaSorteo:string){
    this.service.getUsuariosSorteo(fechaSorteo).subscribe(data =>{
      this.usuariosPartido = data;
      console.log('fecha sorteo',this.usuariosPartido );
    });
      this.usuarioPartidoList();
    }



}


