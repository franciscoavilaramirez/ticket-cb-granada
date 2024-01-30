import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirEntradasComponent } from './subir-entradas.component';

describe('SubirEntradasComponent', () => {
  let component: SubirEntradasComponent;
  let fixture: ComponentFixture<SubirEntradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubirEntradasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubirEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
