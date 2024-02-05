import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivosPDFComponent } from './componentes/archivos-pdf/archivos-pdf.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { HomeComponent} from './pages/home/home.component';
import { SubirEntradasComponent } from './pages/admin/subir-entradas/subir-entradas.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path:'home', component: HomeComponent },
  { path: 'tickets', component: ArchivosPDFComponent},
  { path: 'login', component: LoginPageComponent},
  { path: 'signup', component: RegisterPageComponent},
  { path:'Admin-home', component: AdminHomeComponent },
  { path: 'subir-entradas', component: SubirEntradasComponent},
  { path: 'perfil', component: PerfilComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

