import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-divisor',
  templateUrl: './divisor.component.html',
  styleUrl: './divisor.component.scss'
})
export class DivisorComponent {
  @Input() titulo: string;
}
