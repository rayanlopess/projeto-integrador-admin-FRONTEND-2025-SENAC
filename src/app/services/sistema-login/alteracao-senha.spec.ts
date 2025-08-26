import { TestBed } from '@angular/core/testing';

import { AlteracaoSenha } from './alteracao-senha';

describe('AlteracaoSenha', () => {
  let service: AlteracaoSenha;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlteracaoSenha);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
