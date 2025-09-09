import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimplePopoverComponent } from './simple-popover.component';

describe('SimplePopoverComponent', () => {
  let component: SimplePopoverComponent;
  let fixture: ComponentFixture<SimplePopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SimplePopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SimplePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
