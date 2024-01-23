import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivosPDFComponent } from './componentes/archivos-pdf/archivos-pdf.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { HomeComponent} from './pages/home/home.component';
import { SubirEntradasComponent } from './pages/admin/subir-entradas/subir-entradas.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path:'home', component: HomeComponent },
  { path:'Admin-home', component: AdminHomeComponent },
  { path: 'subir-entradas', component: SubirEntradasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

