import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EmailConfirmacionRoutingModule } from './email-confirmacion.routing.module';

@NgModule({
  declarations: [  ],
  imports: [
    CommonModule,
    TranslateModule,
    EmailConfirmacionRoutingModule
  ],
  providers:[]
})
export class EmailConfirmacionModule { }
