import { Component, Inject } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UsuariosComponent } from '../../pages/admin/usuarios/usuarios.component';
import { Partido } from '../../modelo/partido';

@Component({
  selector: 'app-match-assist-user',
  templateUrl: './match-assist-user.component.html',
  styleUrl: './match-assist-user.component.scss'
})
export class MatchAssistUserComponent {
  contador: number;
  filterPost = '';


  constructor(public apiService: ApiService,public dialog: MatDialog,
              private translate: TranslateService,
              public dialogRef: MatDialogRef<UsuariosComponent>,
              @Inject(MAT_DIALOG_DATA) public partidosInscritos: Partido[]){}

  ngOnInit(){
    this.contador = this.partidosInscritos.length || 0;
  }
  closedModal(): void {
    this.dialogRef.close();
  }

}
