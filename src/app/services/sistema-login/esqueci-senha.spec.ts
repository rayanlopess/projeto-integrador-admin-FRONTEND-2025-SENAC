import { TestBed } from '@angular/core/testing';

import { EsqueciSenha } from './esqueci-senha';

describe('EsqueciSenha', () => {
  let service: EsqueciSenha;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EsqueciSenha);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
