import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwipperPage } from './swipper.page';

describe('SwipperPage', () => {
  let component: SwipperPage;
  let fixture: ComponentFixture<SwipperPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
