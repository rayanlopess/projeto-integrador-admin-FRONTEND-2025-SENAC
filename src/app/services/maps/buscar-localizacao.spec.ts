import { TestBed } from '@angular/core/testing';

import { BuscarLocalizacao } from './buscar-localizacao';

describe('BuscarLocalizacao', () => {
  let service: BuscarLocalizacao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscarLocalizacao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
