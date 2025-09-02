import { TestBed } from '@angular/core/testing';

import { RequiemDosDeusesService } from './requisicao';

describe('Requisicao', () => {
  let service: RequiemDosDeusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequiemDosDeusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
