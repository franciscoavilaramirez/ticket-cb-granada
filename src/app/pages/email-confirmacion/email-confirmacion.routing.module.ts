import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth.guard';
import { EmailConfirmacionComponent } from './email-confirmacion.component';

const routes: Routes = [
  {
    path: '',
    component: EmailConfirmacionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailConfirmacionRoutingModule {}
