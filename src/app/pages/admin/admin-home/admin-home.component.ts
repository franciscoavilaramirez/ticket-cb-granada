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
import { HabilitarEntradasComponent } from '../habilitar-entradas/habilitar-entradas.component';


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
  exportCsv = false;
  usuarios!: Usuario[];
  bodyResponse: Usuario;
  partido!: Partido[];
  proximosPartidos!: Partido[];
  partidosPasados: Partido[] =[];
  usuariosPartido!: Usuario[];
  fechaPartido:string;
  idPartido!: string;
  entradasSobrantes!: any;
  entradas: number;
  filterPost = '';
  @ViewChild('TABLE') table!: ElementRef;

  ColumnsInscritos: string[] = ['id','nombre','apellidos','email'];
  displayedColumns: string[] = ['partido','fecha','usuarios'];

  ngOnInit(){
    this.getUsers();
    this.getProximosPartidos();
    this.getPartidosAnteriores();
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
  openHabilitarEntradas() {
    this.dialog.open(HabilitarEntradasComponent, {
      width: '30vw',
      height: '60vh',
      autoFocus: false
    }).afterClosed().subscribe( () => {
      //this.getProximosPartidos()
    });
  }
  getProximosPartidos(){
    this.apiService.getProximosPartidos().subscribe(data =>{
      this.proximosPartidos = data;
      console.log('Proximos Partidos',this.proximosPartidos);
      this.proximosPartidos.forEach(partido =>{
      });
    });
  }
  getUsuariosPartido(idPartido:any){
    this.apiService.getUsuariosPartido(idPartido).subscribe(data =>{
      this.usuariosPartido = data;

      const dialog = this.dialog.open(ListUserComponent,{
        data: this.usuariosPartido,
        width:'35vw',
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
  getPartidosAnteriores(){
    this.apiService.getPartidosAnteriores().subscribe(partidosAnteriores =>{
      this.partidosPasados = partidosAnteriores;
      console.log('partidos Anteriores', partidosAnteriores);
    });
  }
}







