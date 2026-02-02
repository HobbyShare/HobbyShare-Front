import { TestBed } from '@angular/core/testing';

import { DashboardServiceTs } from './dashboard.service.js';

describe('DashboardServiceTs', () => {
  let service: DashboardServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
