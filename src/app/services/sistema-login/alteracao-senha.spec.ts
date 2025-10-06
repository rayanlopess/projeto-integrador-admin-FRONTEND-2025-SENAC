import { TestBed } from '@angular/core/testing';

import { AlteracaoSenhaService } from './alteracao-senha';

describe('AlteracaoSenha', () => {
  let service: AlteracaoSenhaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlteracaoSenhaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
