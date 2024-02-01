import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { HomeComponent } from './pages/home/home.component';
import { SubirEntradasComponent } from './pages/admin/subir-entradas/subir-entradas.component';
import { AuthGuard } from './guard/auth.guard';
import { AuthIsAdmin } from './guard/authIsAdmin.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: RegisterPageComponent },
  { path: 'admin-home', component: AdminHomeComponent, canActivate: [AuthIsAdmin]},
  { path: 'subir-entradas', component: SubirEntradasComponent, canActivate: [AuthIsAdmin]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

