import { TestBed } from '@angular/core/testing';

import { CalendarServiceTs } from './calendar.service.js';

describe('CalendarServiceTs', () => {
  let service: CalendarServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
