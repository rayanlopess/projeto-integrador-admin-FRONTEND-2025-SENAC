import { TestBed } from '@angular/core/testing';

import { Configuracoes } from './configuracoes';

describe('Configuracoes', () => {
  let service: Configuracoes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Configuracoes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
