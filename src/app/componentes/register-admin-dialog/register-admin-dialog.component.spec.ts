import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAdminDialogComponent } from './register-admin-dialog.component';

describe('RegisterAdminDialogComponent', () => {
  let component: RegisterAdminDialogComponent;
  let fixture: ComponentFixture<RegisterAdminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterAdminDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
