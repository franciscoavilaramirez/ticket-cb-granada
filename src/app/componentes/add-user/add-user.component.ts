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
import { TranslateService, TranslateModule } from '@ngx-translate/core';
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
  usuarios: (Usuario & { selected?: boolean })[] = [];
  usuariosParaAnadirAlPartido: number[] = [];
  filterPost = '';
  cargando = false;

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public partido: Partido,
    public snackBar: MatSnackBar,
    private translate: TranslateService
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

        this.cleanSelections();
        this.cargando = false;
      });
  }

  private cleanSelections(): void {
    const availableIds = new Set(this.usuarios.map(u => u.user_id));
    this.usuariosParaAnadirAlPartido = Array.from(new Set(
      this.usuariosParaAnadirAlPartido.filter(id => availableIds.has(id))
    ));
  }

  trackByUserId(index: number, item: Usuario): any {
    return item?.user_id ?? index;
  }

  get maxSelectable(): number {
    return Math.max(0, (this.partido.stockEntradas || 0));
  }

  get selectedCount(): number {
    return this.usuariosParaAnadirAlPartido.length;
  }

  isCheckboxDisabled(usuario: Usuario): boolean {
    return this.selectedCount >= this.maxSelectable && !usuario.selected;
  }

  addUserToSorteo(userId: number | undefined): void {
    if (userId == null) return;

    const usuario = this.usuarios.find(u => u.user_id === userId);
    if (!usuario) return;

    if (usuario.selected) {
      if (this.selectedCount < this.maxSelectable && !this.usuariosParaAnadirAlPartido.includes(userId)) {
        this.usuariosParaAnadirAlPartido.push(userId);
      } else {
        usuario.selected = false;
      }
    } else {
      this.usuariosParaAnadirAlPartido = this.usuariosParaAnadirAlPartido.filter(id => id !== userId);
    }
  }

  onSubmit(): void {
    const ids = Array.from(new Set(this.usuariosParaAnadirAlPartido.filter(id => typeof id === 'number'))) as number[];
    if (ids.length === 0) {
      this.snackBar.open(
        this.translate.instant('modalAnadirUsuario.errorNoSeleccionados'),
        this.translate.instant('botones.cerrar'),
        { duration: 3000 }
      );
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
        const added = results.filter(r => r.res != null).length;
        this.partido.stockEntradas = Math.max(0, (this.partido.stockEntradas || 0) - added);
        this.snackBar.open(
          this.translate.instant('modalAnadirUsuario.exitoAnadir', { count: added }),
          this.translate.instant('botones.cerrar'),
          { duration: 3500 }
        );
        this.usuarios.forEach(u => u.selected = false);
        this.usuariosParaAnadirAlPartido = [];
        this.refreshAll();
      },
      error: () => {
        this.snackBar.open(
          this.translate.instant('modalAnadirUsuario.errorAnadir'),
          this.translate.instant('botones.cerrar'),
          { duration: 3500 }
        );
        this.refreshAll();
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }

  deleteUserInscrito(userId: number | undefined, partidoArg?: Partido): void {
    if (userId == null) return;
    const partidoToUse = partidoArg?.id ? partidoArg : this.partido;

    this.partido.stockEntradas = (this.partido.stockEntradas || 0) + 1;

    this.apiService.deleteUserMatch(userId, partidoToUse)
      .pipe(catchError(() => of(null)))
      .subscribe({
        next: () => {
          this.usuariosYaInscritos = this.usuariosYaInscritos.filter(u => u.user_id !== userId);
          this.loadAvailableUsers();
          this.snackBar.open(
            this.translate.instant('modalAnadirUsuario.exitoEliminar'),
            this.translate.instant('botones.cerrar'),
            { duration: 3000 }
          );
        },
        error: () => {
          this.partido.stockEntradas = Math.max(0, (this.partido.stockEntradas || 1) - 1);
          this.snackBar.open(
            this.translate.instant('modalAnadirUsuario.errorEliminar'),
            this.translate.instant('botones.cerrar'),
            { duration: 3000 }
          );
        }
      });
  }

  closedModal(): void {
    this.dialogRef.close();
  }
}
