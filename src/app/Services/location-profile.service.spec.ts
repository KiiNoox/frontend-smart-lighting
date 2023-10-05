import { TestBed } from '@angular/core/testing';

import { LocationProfileService } from './location-profile.service';

describe('LocationProfileService', () => {
  let service: LocationProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
