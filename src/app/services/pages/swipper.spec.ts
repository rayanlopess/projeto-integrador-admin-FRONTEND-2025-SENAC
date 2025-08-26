import { TestBed } from '@angular/core/testing';

import { Swipper } from './swipper';

describe('Swipper', () => {
  let service: Swipper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Swipper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
