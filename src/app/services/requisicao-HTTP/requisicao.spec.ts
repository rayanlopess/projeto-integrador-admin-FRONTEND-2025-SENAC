import { TestBed } from '@angular/core/testing';

import { Requisicao } from './requisicao';

describe('Requisicao', () => {
  let service: Requisicao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Requisicao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
