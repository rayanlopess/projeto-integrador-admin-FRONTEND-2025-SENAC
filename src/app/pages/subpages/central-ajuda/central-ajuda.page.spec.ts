import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CentralAjudaPage } from './central-ajuda.page';

describe('CentralAjudaPage', () => {
  let component: CentralAjudaPage;
  let fixture: ComponentFixture<CentralAjudaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralAjudaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
