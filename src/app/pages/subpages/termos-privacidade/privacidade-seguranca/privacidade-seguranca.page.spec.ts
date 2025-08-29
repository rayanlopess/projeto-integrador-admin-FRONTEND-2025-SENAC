import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacidadeSegurancaPage } from './privacidade-seguranca.page';

describe('PrivacidadeSegurancaPage', () => {
  let component: PrivacidadeSegurancaPage;
  let fixture: ComponentFixture<PrivacidadeSegurancaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacidadeSegurancaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
