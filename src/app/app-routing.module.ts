import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivosPDFComponent } from './componentes/archivos-pdf/archivos-pdf.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';

const routes: Routes = [
  { path: '', redirectTo: 'Admin-home', pathMatch: 'full' },
  { path:'Admin-home', component: AdminHomeComponent },
  { path: 'tickets', component: ArchivosPDFComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

