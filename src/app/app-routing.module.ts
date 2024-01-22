import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { ArchivosPDFComponent } from './componentes/archivos-pdf/archivos-pdf.component';
import { SubirEntradasComponent } from './pages/admin/subir-entradas/subir-entradas.component';

const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  { path:'home', component: HomeComponent },
  { path: 'tickets', component: SubirEntradasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

