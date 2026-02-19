import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let httpMock: HttpTestingController;

  const API_URL = 'https://hobbyshare-back.onrender.com/events';

  const mockEventData = {
    title: 'Evento de Prueba',
    description: 'Una descripción detallada',
    hobby: 'Programación',
    date: new Date('2026-02-18T00:00:00.000Z'),
    location: 'Barcelona',
    capacity: 100,
    lat: 0,
    lng: 0
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        EventsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EventsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should load events and update the event signal', () => {
    service.loadEvents();

    const req = httpMock.expectOne(API_URL);
    req.flush([{ id: '1', ...mockEventData }]);

    expect(service.events().length).toBeGreaterThan(0);
    expect(service.events()[0].title).toBe(mockEventData.title);
  });

  it('should create an event and add it to the signal when subscribing', () => {
    const initialCount = service.events().length;

    service.createEvent(mockEventData).subscribe();

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');

    req.flush({ id: 'new-id', ...mockEventData });

    expect(service.events().length).toBe(initialCount + 1);
    expect(service.events()).toContainEqual(expect.objectContaining({ id: 'new-id' }));
  });

  it('should handle the 500 error when loading events', () => {
    service.loadEvents();

    const req = httpMock.expectOne(API_URL);
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(service.events()).toEqual([]);
  });
});
