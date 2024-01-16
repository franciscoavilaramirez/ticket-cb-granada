import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-error-alert-form',
  templateUrl: './error-alert-form.component.html',
  styleUrls: ['./error-alert-form.component.css']
})
export class ErrorAlertFormComponent implements OnChanges {
  @Input() errorMessage: string;
  isVisible = false;

  ngOnChanges() {
    if (this.errorMessage) {
      this.isVisible = true;
      setTimeout(() => this.isVisible = false, 3000); // 3 seconds
    }
  }
}
