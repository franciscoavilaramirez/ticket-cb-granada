import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../modelo/usuario';
import { Partido } from '../../modelo/partido';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterPipe } from '../../pipes/filter.pipe';
import { MatButtonModule } from '@angular/material/button';
import { of, from } from 'rxjs';
import { catchError, concatMap, map, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    TranslateModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    FilterPipe,
    MatButtonModule
  ],
})
export class AddUserComponent implements OnInit {
  usuariosYaInscritos: Usuario[] = [];
  usuarios: Usuario[] = [];
  usuariosParaAnadirAlPartido: number[] = [];
  filterPost = '';
  cargando = false;

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public partido: Partido,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  private refreshAll(): void {
    this.apiService.getUsuariosPartido(this.partido?.id)
      .pipe(catchError(() => of([])))
      .subscribe(inscritos => {
        this.usuariosYaInscritos = Array.isArray(inscritos) ? inscritos : [];
        this.loadAvailableUsers();
      });
  }

  private loadAvailableUsers(): void {
    this.apiService.getUsers()
      .pipe(catchError(() => of([])))
      .subscribe(all => {
        const inscritosIds = new Set((this.usuariosYaInscritos || []).map(u => u.user_id));
        const allArray = Array.isArray(all) ? all : [];

        this.usuarios = allArray
          .filter(u => !inscritosIds.has(u.user_id))
          .map(u => ({ ...u, selected: !!u.selected }));

        const availableIds = new Set(this.usuarios.map(u => u.user_id));
        this.usuariosParaAnadirAlPartido = Array.from(new Set(
          this.usuariosParaAnadirAlPartido.filter(id => id != null && availableIds.has(id))
        ));
      });
  }

  trackByUserId(index: number, item: Usuario): any {
    return item?.user_id ?? index;
  }

  addUserToSorteo(userId: number | undefined): void {
    if (userId == null) return;

    const usuario = this.usuarios.find(u => u.user_id === userId);
    if (!usuario) {
      this.usuariosParaAnadirAlPartido = this.usuariosParaAnadirAlPartido.filter(id => id !== userId);
      return;
    }

    if (usuario.selected) {
      if (!this.usuariosParaAnadirAlPartido.includes(userId)) {
        this.usuariosParaAnadirAlPartido.push(userId);
      }
    } else {
      this.usuariosParaAnadirAlPartido = this.usuariosParaAnadirAlPartido.filter(id => id !== userId);
    }
  }

  onSubmit(): void {
    const ids = Array.from(new Set(this.usuariosParaAnadirAlPartido.filter(id => typeof id === 'number'))) as number[];
    if (ids.length === 0) {
      this.snackBar.open('No hay usuarios seleccionados', 'Cerrar', { duration: 3000 });
      return;
    }

    this.cargando = true;

    from(ids).pipe(
      concatMap(id =>
        this.apiService.addUserMatch(id, this.partido.id).pipe(
          catchError(() => of(null)),
          map(res => ({ id, res }))
        )
      ),
      toArray()
    ).subscribe({
      next: results => {
        let added = 0;
        results.forEach(r => {
          const res = r.res;
          if (res == null) return;
          if (typeof res === 'boolean') {
            if (res === true) added++;
          } else {
            added++;
          }
        });

        if (added > 0) {
          this.partido.stockEntradas = Math.max(0, (this.partido.stockEntradas || 0) - added);
          this.snackBar.open(`${added} usuario(s) añadido(s) correctamente`, 'Cerrar', { duration: 3500 });
        } else {
          this.snackBar.open('No se pudieron añadir los usuarios seleccionados', 'Cerrar', { duration: 3500 });
        }

        this.usuarios.forEach(u => u.selected = false);
        this.usuariosParaAnadirAlPartido = [];

        this.refreshAll();
      },
      error: () => {
        this.snackBar.open('Error al añadir usuarios', 'Cerrar', { duration: 3500 });
        this.refreshAll();
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }

  deleteUserInscrito(userId: number | undefined, partidoArg?: Partido): void {
    if (userId == null) return;
    const partidoToUse = partidoArg && (partidoArg as Partido).id ? partidoArg : this.partido;

    this.apiService.deleteUserMatch(userId, partidoToUse)
      .pipe(catchError(() => of(null)))
      .subscribe(() => {
        this.partido.stockEntradas = (this.partido.stockEntradas || 0) + 1;
        this.refreshAll();
      });
  }

  closedModal(): void {
    this.dialogRef.close();
  }
}
