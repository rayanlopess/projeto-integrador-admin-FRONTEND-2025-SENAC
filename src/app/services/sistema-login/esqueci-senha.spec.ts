import { TestBed } from '@angular/core/testing';

import { EsqueciSenhaService } from './esqueci-senha';

describe('EsqueciSenha', () => {
  let service: EsqueciSenhaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EsqueciSenhaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
