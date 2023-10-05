import { TestBed } from '@angular/core/testing';

import { LignesService } from './lignes.service';

describe('LignesService', () => {
  let service: LignesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LignesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
