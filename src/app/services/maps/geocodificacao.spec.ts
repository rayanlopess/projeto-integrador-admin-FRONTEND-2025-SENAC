import { TestBed } from '@angular/core/testing';

import { Geocodificacao } from './geocodificacao';

describe('Geocodificacao', () => {
  let service: Geocodificacao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Geocodificacao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
