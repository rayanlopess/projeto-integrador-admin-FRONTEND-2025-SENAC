import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TesteMapaPage } from './teste-mapa.page';

describe('TesteMapaPage', () => {
  let component: TesteMapaPage;
  let fixture: ComponentFixture<TesteMapaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TesteMapaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
