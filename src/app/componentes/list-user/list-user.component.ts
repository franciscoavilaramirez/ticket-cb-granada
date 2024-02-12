import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Usuario } from '../../modelo/usuario';
import { AdminHomeComponent } from '../../pages/admin/admin-home/admin-home.component';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent implements OnInit {
contador: any;

constructor(public apiService: ApiService,public dialog: MatDialog,
            private translate: TranslateService,
            public dialogRef: MatDialogRef<AdminHomeComponent>,
            @Inject(MAT_DIALOG_DATA) public usuariosPartido: Usuario[]){}

ngOnInit(){
  //console.log('usuarios partido desde list-user',this.usuariosPartido)
  this.contador = this.usuariosPartido.length || 0;
  console.log('contador usuuuuu desde list-user',this.contador)

}
closedModal(): void {
  this.dialogRef.close();
}


}
