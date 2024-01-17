import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCalendar, MatDateRangeSelectionStrategy } from '@angular/material/datepicker';
import { Usuario } from '../../modelo/usuario';
import { Partido } from '../../modelo/partidos';
import { ServiceService } from './../../service/service.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../update-user/update-user.component';

import Swal from 'sweetalert2';

import { of } from 'rxjs';
import { AddUserComponent } from '../add-user/add-user.component';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
[x: string]: any;


  constructor(private snackBar: MatSnackBar,public service: ServiceService, private router: Router,public dialog: MatDialog) {
    this.createLoginForm();
  }
  // nombre: string;
  // email: string;
  todayDate: Date = new Date();
  selected: Date | null | undefined;
  hiddenList = false;
  hiddenListUsuariosPartidos = false;
  hide = true;
  exportCsv = false;
  usuarios!: Usuario[];
  loginForm: FormGroup;
  bodyResponse: Usuario;
  currentUser: Usuario;
  partidos!: Partido[];
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

  // getProximosPartidos(){
  //   this.service.getPartidos().subscribe(data =>{
  //     this.partidos = data
  //     console.log('data', this.partidos);  });

  //     this.partidos = this.partidos.sort((n1, n2) => {
  //       if (n1.fechaPartido.getTime() > n2.fechaPartido.getTime()){
  //         return 1;
  //       }
  //       if (n1.fechaPartido.getTime() < n2.fechaPartido.getTime()){
  //         return -1;
  //       }

  //       return 0;

  //     })

  //     for (var index in this.partidos) {
  //       if(this.partidos[index].fechaPartido.getTime() < this.todayDate.getTime()){
  //         var mostrados = Math.min(3, +index)
  //         return this.partidos.slice(+index - mostrados, +index);
  //       }
  //     }
  //     return this.partidos.slice(0, 0);

  // }




  createLoginForm(){
    this.loginForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      email: new FormControl("",Validators.required),
      apellido: new FormControl("",Validators.required)

    });
  }
  // onSubmit(){
  //   if(this.loginForm.valid){
  //     const nombre = this.loginForm.get("nombre")?.value;
  //     const email = this.loginForm.get("email")?.value;
  //     const contrasena = this.loginForm.get("contrasena")?.value;

  //     //const contraseña = this.loginForm.get("contraseña")?.value;
  //     console.log("nombre", nombre,"email",email);

  //     this.bodyResponse = {

  //       nombre:nombre,
  //       email:email,
  //       apellido: 'lopez',
  //       is_admin: false,
  //       contrasena: contrasena

  //     }
  //     this.service.insertLogin(this.bodyResponse).subscribe(data => {
  //       console.log("insert", data);
  //     });
  //   }
  // }
  // Login(){
  //   if(this.loginForm.valid){
  //     const nombre = this.loginForm.get("nombre")?.value;
  //     const email = this.loginForm.get("email")?.value;
  //     const contrasena = this.loginForm.get("contrasena")?.value;

  //     //const contraseña = this.loginForm.get("contraseña")?.value;
  //     console.log("nombre", nombre,"email",email);

  //     this.bodyResponse = {

  //       nombre:nombre,
  //       email:email,
  //       apellido: 'lopez',
  //       is_admin: false,
  //       contrasena: contrasena

  //     }
  //   }

  //     //creo que la funcion onsubmit en vez de log in lo que hace es añadir un usuario. voy a intentar pedir el usuario al servicio para
  //     //después cargar la variable currentUser como ese.

  //     this.currentUser = this.service.Login(this.bodyResponse)
  // }

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

  onDateInput(event: any) {
    const selectedDate = new Date(event.target.value);
    this.todayDate = selectedDate;
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


