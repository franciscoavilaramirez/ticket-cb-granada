import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { UpdateUserComponent } from './componentes/update-user/update-user.component';
import { LoginComponent } from './componentes/login/login.component';
import { NuevoPartidoComponent } from './componentes/nuevo-partido/nuevo-partido.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path:'home', component: HomeComponent},
  {path:'updateuser', component: UpdateUserComponent}, 
  {path:'login', component: LoginComponent},
  {path:'nuevoPartido', component:NuevoPartidoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
