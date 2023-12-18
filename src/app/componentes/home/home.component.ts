import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCalendar, MatDateRangeSelectionStrategy } from '@angular/material/datepicker';
import { Usuario } from '../../modelo/empleados';
import { Partido } from '../../modelo/partidos';
import { ServiceService } from './../../service/service.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../update-user/update-user.component';





// const ELEMENT_DATA: Empleado[] = [
//   {id: 1, nombre: 'Hydrogen', apellido: 'Perez', email: 'H'},
//   {id: 2, nombre: 'Helium',   apellido: 'Perez', email: 'He'},
//   {id: 3, nombre: 'Lithium',  apellido: 'Perez', email: 'Li'},
//   {id: 4, nombre: 'Beryllium',apellido: 'Perez', email: 'Be'},
//   {id: 5, nombre: 'Boron',    apellido: 'Perez', email: 'B'},
// ];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {


  constructor(private snackBar: MatSnackBar,private service: ServiceService, private router: Router,public dialog: MatDialog) {
    this.createLoginForm();
  }
  // nombre: string;
  // email: string;
  todayDate: Date = new Date();
  selected: Date | null | undefined;
  hiddenList = false;
  hide = true;
  exportCsv = false;
  usuarios!: Usuario[];
  loginForm: FormGroup;
  bodyResponse: Usuario;
  currentUser: Usuario;
  partidos : Partido[];

  @ViewChild('TABLE')table!: ElementRef;

  ngOnInit(){
    this.getUsers();

  }
  getUsers(){
    this.service.getUsers().subscribe(data =>{
      this.usuarios = data
      console.log('data', this.usuarios);
    });
  }
  
  getProximosPartidos(){
    this.service.getPartidos().subscribe(data =>{
      this.partidos = data
  });



  }




  createLoginForm(){
    this.loginForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      email: new FormControl("",Validators.required),
      apellido: new FormControl("",Validators.required)

    });
  }
  onSubmit(){
    if(this.loginForm.valid){
      const nombre = this.loginForm.get("nombre")?.value;
      const email = this.loginForm.get("email")?.value;
      const contrasena = this.loginForm.get("contrasena")?.value;

      //const contraseña = this.loginForm.get("contraseña")?.value;
      console.log("nombre", nombre,"email",email);

      this.bodyResponse = {

        nombre:nombre,
        email:email,
        apellido: 'lopez',
        isAdmin: false,
        contrasena: contrasena

      }
      this.service.insertLogin(this.bodyResponse).subscribe(data => {
        console.log("insert", data);
      });



    }
  }



  Login(){
    if(this.loginForm.valid){
      const nombre = this.loginForm.get("nombre")?.value;
      const email = this.loginForm.get("email")?.value;
      const contrasena = this.loginForm.get("contrasena")?.value;

      //const contraseña = this.loginForm.get("contraseña")?.value;
      console.log("nombre", nombre,"email",email);

      this.bodyResponse = {

        nombre:nombre,
        email:email,
        apellido: 'lopez',
        isAdmin: false,
        contrasena: contrasena

      }
    }

    
      //creo que la funcion onsubmit en vez de log in lo que hace es añadir un usuario. voy a intentar pedir el usuario al servicio para
      //después cargar la variable currentUser como ese.

      this.currentUser = this.service.Login(this.bodyResponse)
  }

  deleteUser(user: Usuario): void {
    this.service.deleteUser(user).subscribe(data => {
      console.log("Usuario eliminado");
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

  displayedColumns: string[] = ['no','nombre','apellido','email','botones'];

  userList(){
    this.hiddenList = true;
    this.exportCsv = true;
  }
  hiddenUserList(){
    this.hiddenList = false;
    this.exportCsv = false;

  }

  isAdmin(){
    return this.currentUser.isAdmin;
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

  ;


  }

}


