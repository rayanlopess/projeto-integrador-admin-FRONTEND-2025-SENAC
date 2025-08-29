import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelaLogoPage } from './tela-logo.page';

describe('TelaLogoPage', () => {
  let component: TelaLogoPage;
  let fixture: ComponentFixture<TelaLogoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaLogoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
