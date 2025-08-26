import { TestBed } from '@angular/core/testing';

import { ValidacaoEmail } from './validacao-email';

describe('ValidacaoEmail', () => {
  let service: ValidacaoEmail;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidacaoEmail);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
