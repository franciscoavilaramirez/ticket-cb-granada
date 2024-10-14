import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-divisor',
  templateUrl: './divisor.component.html',
  styleUrl: './divisor.component.scss',
  standalone: true,
  imports: [
    TranslateModule
  ]
})
export class DivisorComponent {
  @Input() titulo: string;
}
