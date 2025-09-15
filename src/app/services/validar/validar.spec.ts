import { TestBed } from '@angular/core/testing';

import { Validar } from './validar';

describe('Validar', () => {
  let service: Validar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Validar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
