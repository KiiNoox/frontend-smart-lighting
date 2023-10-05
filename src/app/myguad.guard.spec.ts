import { TestBed } from '@angular/core/testing';

import { MyguadGuard } from './myguad.guard';

describe('MyguadGuard', () => {
  let guard: MyguadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MyguadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
