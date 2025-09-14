import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoDadosPage } from './aviso-dados.page';

describe('AvisoDadosPage', () => {
  let component: AvisoDadosPage;
  let fixture: ComponentFixture<AvisoDadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisoDadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
