import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidacaoEmailPage } from './validacao-email.page';

describe('ValidacaoEmailPage', () => {
  let component: ValidacaoEmailPage;
  let fixture: ComponentFixture<ValidacaoEmailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacaoEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
