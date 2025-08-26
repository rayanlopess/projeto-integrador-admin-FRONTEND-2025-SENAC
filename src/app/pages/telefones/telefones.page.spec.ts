import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelefonesPage } from './telefones.page';

describe('TelefonesPage', () => {
  let component: TelefonesPage;
  let fixture: ComponentFixture<TelefonesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TelefonesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
