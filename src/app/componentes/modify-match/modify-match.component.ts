import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Partido } from '../../modelo/partidos';
import { ServiceService } from '../../service/service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';
import { Usuario } from '../../modelo/usuario';

@Component({
  selector: 'app-modify-match',
  templateUrl: './modify-match.component.html',
  styleUrl: './modify-match.component.scss'
})
export class ModifyMatchComponent {

  updateMatchForm:FormGroup;
  partido!: Partido[];

  constructor(private service:ServiceService,public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdminHomeComponent>,
    @Inject(MAT_DIALOG_DATA) public matchModify: Partido){
      this.createFormUpdateMatch();
  }
  ngOnInit(){
    this.getPartidos();
  }

  createFormUpdateMatch(){
    this.updateMatchForm = new FormGroup({
      nombrePartido: new FormControl(this.matchModify.nombrePartido),
      fechaPartido: new FormControl(this.matchModify.fechaPartido),
      id:new FormControl(this.matchModify.id),
      //stockEntradas:new FormControl(this.matchModify.stockEntradas)
    });
  }
  getPartidos(){
    this.service.getPartidos().subscribe(data =>{
      this.partido = data
      //console.log('Partidos desde modify-match', this.partido);
    });
  }
  onSubmit(){
    let dataPartido: Partido
    if(this.updateMatchForm.valid){
      const bodyResponse: Partido = this.updateMatchForm.value;
      //console.log("bodyResponse",bodyResponse);
      this.service.updateMatch(bodyResponse).subscribe(data =>{
        this.closedModal();
      });

    }
  }
  closedModal(): void {
    this.dialogRef.close();
  }

}
