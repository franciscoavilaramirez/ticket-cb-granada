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
  hide = true;
  exportCsv = false;
  usuarios!: Usuario[];
  bodyResponse: Usuario;
  currentUser: Usuario;
  partido!: Partido[];
  proximosPartidos!: Partido[];
  usuariosPartido!: Usuario[];
  fechaPartido:string;
  idPartido!: string;
  entradasSobrantes!: any;
  entradas: number;


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
      //console.log('Usuarios', this.usuarios);
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
      this.getUsers();
    });
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
    }).afterClosed().subscribe( () => {
      this.getProximosPartidos()
    });
  }
  openAddUser(partido: Partido) {
    const dialog = this.dialog.open(AddUserComponent,{
      data: partido,
      width:'50vw',
      height:'85vh'
    });
    dialog.afterClosed().subscribe(result => {
      //console.log('stock entradas',partido.stockEntradas);

      // if (result && result.usuarioAgregado) {
      //   partido.stockEntradas--; // Restar 1 al stock de entradas
      //   console.log('stock entradas',partido.stockEntradas);
      // }
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
    this.apiService.getPartidos().subscribe(data =>{
      this.proximosPartidos = data;
      console.log('Proximos Partidos',this.proximosPartidos);
      this.proximosPartidos.forEach(partido =>{
        console.log('partido',partido)
      });
    });
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
    this.apiService.deleteMatch(partidoId).subscribe(data =>{
          console.log('partido borrado',data);
          this.getProximosPartidos();
        });
  }
}







