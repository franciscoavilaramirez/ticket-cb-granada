import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Partido } from '../../../modelo/partido';
import { Router } from '@angular/router';
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
import { Subscription } from 'rxjs';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
  standalone:false,

})
export class AdminHomeComponent {
[x: string]: any;

  constructor(private snackBar: MatSnackBar,public apiService: ApiService,
              private router: Router,public dialog: MatDialog,
              private translate: TranslateService) {
              this.translate.setDefaultLang(this.activeLang);

  }
  partidosFuturos: Partido[] =[];
  misPartidosIds: number[]
  idUsuario: number
  activeLang = 'es';
  exportCsv = false;
  usuarios!: Usuario[];
  bodyResponse: Usuario;
  partido!: Partido[];
  proximosPartidos!: Partido[];
  usuariosPartido!: Usuario[];
  fechaPartido:string;
  idPartido!: string;
  entradasSobrantes!: any;
  entradas: number;
  partidosPasados: Partido[] =[];
  spinnerShow = true;
  color: ThemePalette = "accent";
  @ViewChild('TABLE') table!: ElementRef;
  private subscription: Subscription;

  ColumnsInscritos: string[] = ['id','nombre','apellidos','email'];
  displayedColumns: string[] = ['partido','fecha','usuarios'];
  displayColumns: string[] = ['partido','fechaDelPartido','editar'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Partido>([]);
  filterTerm: string = '';  // Valor del input para la búsqueda


  ngOnInit(){
    this.getUsers();
    this.getProximosPartidos();
    this.getPartidosAnteriores();
    this.getPartidosFuturos();
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();  // Filtrar los datos
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

    dialog.afterClosed().subscribe(result => {
      this.getProximosPartidos();
      this.getPartidosFuturos();
    });

  }
  openAddUser(partido: Partido) {
    const dialog = this.dialog.open(AddUserComponent,{
      data: partido,
      width:'35vw',
      height:'85vh'
    });
    dialog.afterClosed().subscribe(result => {
      this.getProximosPartidos()
    });
  }
  openModifyMatch(partido: Partido) {
    const dialog = this.dialog.open(ModifyMatchComponent,{
      data: partido,
      width:'35vw',
      height:'90vh'
    });
    dialog.afterClosed().subscribe(result => {
      this.getProximosPartidos();
      this.getPartidosFuturos();
    });
  }

  getProximosPartidos(){
    this.apiService.getProximosPartidos().subscribe(data =>{
      this.proximosPartidos = data;
      console.log('get Proximos Partidos',this.proximosPartidos);
      this.spinnerShow = false;
      this.idUsuario = this.getUsuarioId()

      this.apiService.getMisPartidosIds(this.idUsuario).subscribe(misPartidosIds => {
        this.misPartidosIds = misPartidosIds

        this.proximosPartidos.forEach(partido => {
          if (this.misPartidosIds?.includes(partido.id))
            partido.tengoEntrada = true;
          else
          partido.tengoEntrada = false;
        })
      })
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
        this.apiService.deleteMatch(partidoId).subscribe( (success) =>{
          Swal.fire("Partido Eliminado", "", "success");
            this.getProximosPartidos();
        });
      }
    });
  }


  getPartidosAnteriores(){
    this.apiService.getPartidosAnteriores().subscribe(partidosAnteriores =>{
      this.partidosPasados = partidosAnteriores;
      this.dataSource.data = partidosAnteriores;
      this.dataSource.data = this.partidosPasados;  // Asignar los datos al dataSource

      console.log('partidos Anteriores', partidosAnteriores);
    });
  }

  getUsuarioId(): number {
    let userStr = localStorage.getItem('user');
    if (userStr == null)
      return -1
    else
      return JSON.parse(userStr).id
  }
  devolver(idPartido: number) {
    this.apiService.desasignarEntrada(this.idUsuario, idPartido).subscribe(() => {
      this.proximosPartidos.forEach(partido => {
          if (partido.id == idPartido) {
            partido.tengoEntrada = false;
            //partido.stockEntradas = true;
            partido.stockEntradas ++;
          }
        });
      })
      this.getProximosPartidos()
  }
  apuntarse(idPartido: number) {
    this.apiService.asignarEntrada(this.idUsuario, idPartido).subscribe(response => {
       if(response == true){
        this.proximosPartidos.forEach(partido => {
              if (partido.id == idPartido){
                partido.tengoEntrada = true;
                partido.stockEntradas --;
              }
            });
        } else {
          alert("No quedan entradas")
        }
    })
    this.getProximosPartidos()
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
        //return new Blob([byteArray], { type: 'application/pdf' });
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
  getPartidosFuturos(){
    this.apiService.getProximosPartidosDisponibles().subscribe(partidosFuturos =>{
      this.partidosFuturos = partidosFuturos;
      console.log('partidos futuros',this.partidosFuturos)
    });
  }
}







