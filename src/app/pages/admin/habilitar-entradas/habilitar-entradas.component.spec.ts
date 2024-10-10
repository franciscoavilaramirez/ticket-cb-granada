import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitarEntradasComponent } from './habilitar-entradas.component';

describe('HabilitarEntradasComponent', () => {
  let component: HabilitarEntradasComponent;
  let fixture: ComponentFixture<HabilitarEntradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabilitarEntradasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HabilitarEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
