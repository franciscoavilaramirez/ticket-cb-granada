import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCalendar, MatDateRangeSelectionStrategy } from '@angular/material/datepicker';
import { Usuario } from '../../modelo/empleados';
import { ServiceService } from './../../service/service.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';




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


  constructor(private snackBar: MatSnackBar,private service: ServiceService, private router: Router) {}

  todayDate: Date = new Date();
  selected: Date | null | undefined;
  hiddenList = false;
  exportCsv = false;
  usuarios!: Usuario[];

  @ViewChild('TABLE')table!: ElementRef;

  ngOnInit(){
    this.service.getUsers().subscribe(data =>{
      this.usuarios = data
      console.log('data', this.usuarios);
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

  displayedColumns: string[] = ['id', 'nombre','email'];
  //dataSource = ELEMENT_DATA;

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
}
