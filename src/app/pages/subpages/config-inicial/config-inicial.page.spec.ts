import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigInicialPage } from './config-inicial.page';

describe('ConfigInicialPage', () => {
  let component: ConfigInicialPage;
  let fixture: ComponentFixture<ConfigInicialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigInicialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
