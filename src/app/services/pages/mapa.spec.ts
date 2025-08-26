import { TestBed } from '@angular/core/testing';

import { Mapa } from './mapa';

describe('Mapa', () => {
  let service: Mapa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mapa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
