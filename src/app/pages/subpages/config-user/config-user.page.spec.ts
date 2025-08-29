import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigUserPage } from './config-user.page';

describe('ConfigUserPage', () => {
  let component: ConfigUserPage;
  let fixture: ComponentFixture<ConfigUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
