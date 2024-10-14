import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntradasUsuarioComponent } from './add-entradas-usuario.component';

describe('AddEntradasUsuarioComponent', () => {
  let component: AddEntradasUsuarioComponent;
  let fixture: ComponentFixture<AddEntradasUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEntradasUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEntradasUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
