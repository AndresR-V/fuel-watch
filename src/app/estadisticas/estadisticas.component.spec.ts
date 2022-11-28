import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasComponent } from './estadisticas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
describe('EstadisticasComponent', () => {
  let component: EstadisticasComponent;
  let fixture: ComponentFixture<EstadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
