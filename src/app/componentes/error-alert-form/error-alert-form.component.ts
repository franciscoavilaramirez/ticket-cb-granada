import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-error-alert-form',
  templateUrl: './error-alert-form.component.html',
  styleUrls: ['./error-alert-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    // BrowserModule
  ]
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
