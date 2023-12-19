import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosPDFComponent } from './archivos-pdf.component';

describe('ArchivosPDFComponent', () => {
  let component: ArchivosPDFComponent;
  let fixture: ComponentFixture<ArchivosPDFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivosPDFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivosPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
