import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { ArchivosPDFComponent } from './componentes/archivos-pdf/archivos-pdf.component';
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { RegisterPageComponent } from '../pages/register-page/register-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path:'home', component: HomeComponent },
  { path: 'tickets', component: ArchivosPDFComponent},
  { path: 'login', component: LoginPageComponent},
  { path: 'signup', component: RegisterPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

