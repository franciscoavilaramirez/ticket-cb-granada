import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Partido } from '../../../modelo/partido';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Usuario } from '../../../modelo/usuario';
import { UpdateUserComponent } from '../../../componentes/update-user/update-user.component';
import { AddUserComponent } from '../../../componentes/add-user/add-user.component';
import { ModifyMatchComponent } from '../../../componentes/modify-match/modify-match.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../service/api.service';
import { SubirEntradasComponent } from '../subir-entradas/subir-entradas.component';
import { ListUserComponent } from '../../../componentes/list-user/list-user.component';


@Component({
  selector: 'app-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {
[x: string]: any;


  constructor(private snackBar: MatSnackBar,public apiService: ApiService,
              private router: Router,public dialog: MatDialog,
              private translate: TranslateService) {
              this.translate.setDefaultLang(this.activeLang);
  }

  activeLang = 'es';
  hiddenList = false;
 // hiddenListUsuariosPartidos = false;
  hide = true;
  exportCsv = false;
  usuarios!: Usuario[];
  bodyResponse: Usuario;
  currentUser: Usuario;
  //partidos!: Partido[];
  partido!: Partido[];
  proximosPartidos!: Partido[];
  usuariosPartido!: Usuario[];
  fechaPartido:string;
  idPartido!: string;


  @ViewChild('TABLE')table!: ElementRef;
  @ViewChild('TABLEUSUARIOSPARTIDO')tableUsuariosPartido!: ElementRef;

  displayedColumns: string[] = ['id','nombre','apellidos','email','acciones'];
  ColumnsInscritos: string[] = ['id','nombre','apellidos','email'];

  ngOnInit(){
    this.getUsers();
    this.getProximosPartidos();
  }
  public cambiarLenguaje(lang: string) {
    this.activeLang = lang;
    this.translate.use(lang);
  }

  getUsers(){
    this.apiService.getUsers().subscribe(data =>{
      this.usuarios = data
      console.log('Usuarios', this.usuarios);
    });
  }

  deleteUser(userId: string): void {

    this.apiService.deleteUser(userId).subscribe(async data => {
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
  // openSnackBar() {
  //   this.snackBar.open('Correo enviado satisfactoriamente', 'Cerrar', {
  //     duration: 3000
  //   });
  // }

  userList(){
    this.hiddenList = true;
    this.exportCsv = true;
  }
  hiddenUserList(){
    this.hiddenList = false;
    this.exportCsv = false;
  }
  // usuarioPartidoList(){
  //   this.hiddenListUsuariosPartidos = !this.hiddenListUsuariosPartidos;
  // }
  // isAdmin(){
  //   return this.currentUser.is_admin;
  // }
  ExportTOExcel()
{
  const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, 'Listado_Usuarios.xlsx');
}
  openDialog(usuarioAny:any) {

     let usuario:Usuario = {
      id:usuarioAny.user_id,
      nombre:usuarioAny.nombre,
      apellidos: usuarioAny.apellidos,
      email:usuarioAny.email
     }
    console.log('usuarioAny',usuarioAny, 'usuario',usuario);
    const dialog = this.dialog.open(UpdateUserComponent,{
      data: usuario,
      width:'25vw',
      height:'85vh'
    });

    dialog.afterClosed().subscribe(result => {
      this.getUsers();
    });

  }

  openSubirEntradas() {
    this.dialog.open(SubirEntradasComponent, {
      width: '50vw',
      height: '70vh',
      autoFocus: false
    });
  }
  openAddUser(partido: Partido) {
    const dialog = this.dialog.open(AddUserComponent,{
      data: partido,
      width:'50vw',
      height:'85vh'
    });
    dialog.afterClosed().subscribe(result => {
    });
  }
  openModifyMatch(partido: Partido) {
    const dialog = this.dialog.open(ModifyMatchComponent,{
      data: partido,
      width:'25vw',
      height:'90vh'
    });
    dialog.afterClosed().subscribe(result => {
      this.getProximosPartidos();
    });
  }

  openListUser(){
    //console.log('List usuario');


  }
  getProximosPartidos(){
    this.apiService.getProximosPartidos().subscribe(data =>{
      this.proximosPartidos = data;
      console.log('Proximos Partidos',this.proximosPartidos);
    })
  }
  getUsuariosPartido(idPartido:any){
    this.apiService.getUsuariosPartido(idPartido).subscribe(data =>{
      this.usuariosPartido = data;
      const dialog = this.dialog.open(ListUserComponent,{
        data: this.usuariosPartido,
        width:'25vw',
        height:'75vh',
      });

      dialog.afterClosed().subscribe(result => {
        this.getUsers();
      });
    });

    }
  deleteMatch(partidoId: Partido){
    Swal.fire({
      title: '¿Seguro que desea eliminar este partido?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar',
      confirmButtonColor: 'red',
      denyButtonColor: 'grey',
    }).then((response) => {
      if (response.isConfirmed) {
        this.apiService.deleteMatch(partidoId).subscribe( () =>{
            this.getProximosPartidos();
        });        
      }  
    });
  }

  // getNextMacht(){
  //   this.apiService.getNextMatch().subscribe(data =>{
  //     console.log('proxims partidos',data);
  //     this.getPartidos();
  //   });

  // }
}


