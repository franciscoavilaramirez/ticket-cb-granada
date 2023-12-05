import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCalendar, MatDateRangeSelectionStrategy } from '@angular/material/datepicker';
import { Usuario } from '../../modelo/empleados';
import { ServiceService } from './../../service/service.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';




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


  constructor(private snackBar: MatSnackBar,private service: ServiceService, private router: Router) {
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
      const apellido = this.loginForm.get("apellido")?.value;

      //const contraseña = this.loginForm.get("contraseña")?.value;
      console.log("nombre", nombre,"email",email);

      this.bodyResponse = {

        nombre:nombre,
        email:email,
        apellido: apellido,
        isAdmin: false

      }
      this.service.insertLogin(this.bodyResponse).subscribe(data => {
        console.log("insert", data);
      });

    }
  }
  // deleteUser(email: string): void {
  //   this.service.deleteUser(email).subscribe(data => {
  //     console.log("deleteeeeeeeee");
  //     this.getUsers();

  //   });
  // }
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
  ExportTOExcel()
{
  const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  /* save to file */
  XLSX.writeFile(wb, 'Listado_Usuarios.xlsx');
}
  fecha1 = new Date('2023-11-01');
  fecha2 = new Date('2023-11-15');
  fecha3 = new Date('2023-11-28');

  fechasMarcadas = [this.fecha1,this.fecha2,this.fecha3];

}
