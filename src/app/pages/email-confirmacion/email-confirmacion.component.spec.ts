import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfirmacionComponent } from './email-confirmacion.component';

describe('EmailConfirmacionComponent', () => {
  let component: EmailConfirmacionComponent;
  let fixture: ComponentFixture<EmailConfirmacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailConfirmacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
