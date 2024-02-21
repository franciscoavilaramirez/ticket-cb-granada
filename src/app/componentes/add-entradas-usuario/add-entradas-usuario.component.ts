import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HomeComponent } from '../../pages/home/home.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-entradas-usuario',
  templateUrl: './add-entradas-usuario.component.html',
  styleUrl: './add-entradas-usuario.component.scss'
})
export class AddEntradasUsuarioComponent implements OnInit {

addTicketsForm: FormGroup;

constructor(private apiService:ApiService,public dialogRef: MatDialogRef<HomeComponent>){}


  ngOnInit(): void {
    this.createAddTicketsForm();
  }

createAddTicketsForm(){
  this.addTicketsForm = new FormGroup({
    numeroTickets: new FormControl(''),
  })
}
onSubmit(){
this.apiService.getDescargarEntradasAdi('31',2,5).subscribe(data =>{
console.log('dataaaaa',data);
});
}

  closedModal(): void {
    this.dialogRef.close();
    //this.apiService.getProximosPartidos();
}
}
