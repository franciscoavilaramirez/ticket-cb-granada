import { Component, Inject } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UsuariosComponent } from '../../pages/admin/usuarios/usuarios.component';
import { Partido } from '../../modelo/partido';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-match-assist-user',
  templateUrl: './match-assist-user.component.html',
  styleUrl: './match-assist-user.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    TranslateModule,
    MatListModule,
    FilterPipe
  ],
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
