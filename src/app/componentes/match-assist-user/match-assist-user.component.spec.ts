import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchAssistUserComponent } from './match-assist-user.component';

describe('MatchAssistUserComponent', () => {
  let component: MatchAssistUserComponent;
  let fixture: ComponentFixture<MatchAssistUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchAssistUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchAssistUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
