<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Map } from './map';

describe('Map', () => {
  let component: Map;
  let fixture: ComponentFixture<Map>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Map]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Map);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
=======
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MapComponent } from './map';
import { EventsService } from '../../core/services/events.service';
import { MapService } from '../../core/services/map.service';
import { Router } from '@angular/router';
import { NavigationService } from '../../core/services/navigation.service';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mockMapService: any;
  let mockEventsService: any;

  beforeEach(async () => {
    mockMapService = {
      initMap: vi.fn().mockReturnValue({}), 
      destroyMap: vi.fn(),
      onMapClick: vi.fn(),
      createMarker: vi.fn().mockReturnValue({ openPopup: vi.fn(), setLatLng: vi.fn() }),
      removeMarker: vi.fn(),
      removeMarkers: vi.fn(),
      createEventMarkers: vi.fn().mockReturnValue([]),
      createSelectionIcon: vi.fn(),
      createUserIcon: vi.fn(),
      onMarkerDragEnd: vi.fn(),
      setView: vi.fn(),
      getUserLocation: vi.fn().mockResolvedValue({ lat: 40, lng: -3 })
    };

    mockEventsService = {
      events: signal([]),
      loadEvents: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [
        { provide: MapService, useValue: mockMapService },
        { provide: EventsService, useValue: mockEventsService },
        { provide: Router, useValue: { url: '/map', navigate: vi.fn() } },
        { provide: NavigationService, useValue: { setPreviousUrl: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
  });
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  it('should create and initialize the map', async() => {
    fixture.detectChanges();
    await delay(0);
    expect(mockMapService.initMap).toHaveBeenCalled();
  });

  it('should load events on init when mode is view', async() => {
    component.mode = 'view';
    fixture.detectChanges();
    await delay(0);
    expect(mockEventsService.loadEvents).toHaveBeenCalled();
  });

  it('should setup selection mode and react to map clicks', async() => {
    component.mode = 'select';
    fixture.detectChanges();
    await delay(0);

    expect(mockMapService.onMapClick).toHaveBeenCalled();
  });

  it('should emit locationSelected when a marker is placed', async() => {
    const emitSpy = vi.spyOn(component.locationSelected, 'emit');
    fixture.detectChanges();
    await delay(0);

    (component as any).placeSelectionMarker(40, -3);

    expect(emitSpy).toHaveBeenCalledWith({ lat: 40, lng: -3 });
    expect(component.selectedLocation()).toEqual({ lat: 40, lng: -3 });
  });

  it('should repaint markers when events signal changes', async() => {
    fixture.detectChanges();
    await delay(0);

    mockEventsService.events.set([{ _id: '1', lat: 10, lng: 10 }]);

    fixture.detectChanges();

    expect(mockMapService.createEventMarkers).toHaveBeenCalled();
  });

  it('should call getUserLocation and set view when getLocation is called', async () => {
    (component as any).map = { dummy: true };

    fixture.detectChanges();

    await component.getLocation();

    expect(mockMapService.getUserLocation).toHaveBeenCalled();
    expect(mockMapService.setView).toHaveBeenCalled();
  });

  it('should destroy map instance on destroy', () => {
    (component as any).map = {};
    component.ngOnDestroy();
    expect(mockMapService.destroyMap).toHaveBeenCalledWith(component.containerId);
  });

  it('should expose navigateToEvent to window and use router', () => {
    fixture.detectChanges();
    const router = TestBed.inject(Router);

    expect((window as any).navigateToEvent).toBeDefined();
    (window as any).navigateToEvent('123');

    expect(router.navigate).toHaveBeenCalledWith(['/events', '123']);
>>>>>>> refactor/styles
  });
});
