import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorAlertFormComponent } from './error-alert-form.component';

describe('ErrorAlertFormComponent', () => {
  let component: ErrorAlertFormComponent;
  let fixture: ComponentFixture<ErrorAlertFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorAlertFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorAlertFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
