import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ArchivosPDFComponent } from './componentes/archivos-pdf/archivos-pdf.component';
import { SubirEntradasComponent } from './pages/admin/subir-entradas/subir-entradas.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'tickets',
    component: ArchivosPDFComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login-page/login-page.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/register-page/register-page.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'admin-home',
    loadChildren: () =>
      import('./pages/admin/admin-home/admin-home.module').then(
        (m) => m.AdminHomeModule
      ),
  },
  {
    path: 'subir-entradas',
    component: SubirEntradasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'usuarios',
    loadChildren: () =>
      import('./pages/admin/usuarios/usuarios.module').then(
        (m) => m.UsuariosModule
      ),
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./pages/perfil/perfil.module').then((m) => m.PerfilModule),
  },
  {
    path: 'email',
    loadChildren: () =>
      import('./pages/email-confirmacion/email-confirmacion.module').then((m) => m.EmailConfirmacionModule),
  },
  // {
  //   path: 'tickets',
  //   component: ArchivosPDFComponent,
  //   canActivate: [AuthGuard],
  // },
  // { path: 'login', component: LoginPageModule },
  // { path: 'signup', component: RegisterPageModule },
  // { path: 'admin-home', component: AdminHomeModule, canActivate: [AuthGuard] },
  // {
  //   path: 'subir-entradas',
  //   component: SubirEntradasComponent,
  //   canActivate: [AuthGuard],
  // },
  // { path: 'usuarios', component: UsuariosModule, canActivate: [AuthGuard] },
  // { path: 'perfil', component: PerfilModule, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
