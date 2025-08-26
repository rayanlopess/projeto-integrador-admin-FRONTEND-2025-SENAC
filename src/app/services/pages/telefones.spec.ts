import { TestBed } from '@angular/core/testing';

import { Telefones } from './telefones';

describe('Telefones', () => {
  let service: Telefones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Telefones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
