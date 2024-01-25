import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Partido } from '../../modelo/partidos';
import { ServiceService } from '../../service/service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';

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
      titulo: new FormControl(this.matchModify.nombrePartido),
      fecha: new FormControl(this.matchModify.fechaPartido),
      id:new FormControl(this.matchModify.id)

    });
  }
  getPartidos(){
    this.service.getPartidos().subscribe(data =>{
      this.partido = data
      console.log('Partidos desde modify-match', this.partido);
    });
  }


  onSubmit(){}



  closedModal(): void {
    this.dialogRef.close();
  }

}
