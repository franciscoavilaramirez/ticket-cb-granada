import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMatchComponent } from './modify-match.component';

describe('ModifyMatchComponent', () => {
  let component: ModifyMatchComponent;
  let fixture: ComponentFixture<ModifyMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyMatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
