import { TestBed } from '@angular/core/testing';

import { ThemeAction } from './theme-action';

describe('ThemeAction', () => {
  let service: ThemeAction;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeAction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
