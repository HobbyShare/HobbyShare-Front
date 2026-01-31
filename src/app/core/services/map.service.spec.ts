import { TestBed } from '@angular/core/testing';

import { MapServiceTs } from './map.service.ts';

describe('MapServiceTs', () => {
  let service: MapServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
