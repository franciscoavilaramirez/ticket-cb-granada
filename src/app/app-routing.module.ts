import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivosPDFComponent } from './componentes/archivos-pdf/archivos-pdf.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { HomeComponent} from './pages/home/home.component';
import { SubirEntradasComponent } from './pages/admin/subir-entradas/subir-entradas.component';
import { UsuariosComponent } from './pages/admin/usuarios/usuarios.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path:'home', component: HomeComponent, canActivate:[AuthGuard] },
  { path: 'tickets', component: ArchivosPDFComponent},
  { path: 'login', component: LoginPageComponent},
  { path: 'signup', component: RegisterPageComponent},
  { path:'admin-home', component: AdminHomeComponent, canActivate:[AuthGuard] },
  // {
  //   path: 'admin-home',
  //   loadComponent:() =>
  //     import('./pages/admin/admin-home/admin-home.component').then(
  //       (c) => c.AdminHomeComponent
  //     ),
  //     canActivate:[authGuard],
  // },
  { path: 'subir-entradas', component: SubirEntradasComponent},
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'perfil', component: PerfilComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

