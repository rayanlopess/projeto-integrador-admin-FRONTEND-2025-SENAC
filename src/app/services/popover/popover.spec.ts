import { TestBed } from '@angular/core/testing';

import { Popover } from './popover';

describe('Popover', () => {
  let service: Popover;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Popover);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
