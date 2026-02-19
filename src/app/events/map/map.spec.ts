
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MapComponent } from './map';
import { EventsService } from '../../core/services/events.service';
import { MapService } from '../../core/services/map.service';
import { NavigationService } from '../../core/services/navigation.service';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import * as L from 'leaflet';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  const mockMap = {
    setView: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    on: vi.fn(),
  } as unknown as L.Map;

  const mockMarker = {
    addTo: vi.fn().mockReturnThis(),
    setLatLng: vi.fn().mockReturnThis(),
    openPopup: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    remove: vi.fn(),
  } as unknown as L.Marker;

  const mockMapService = {
    initMap: vi.fn().mockReturnValue(mockMap),
    createMarker: vi.fn().mockReturnValue(mockMarker),
    removeMarker: vi.fn(),
    removeMarkers: vi.fn(),
    createEventMarkers: vi.fn().mockReturnValue([]),
    createSelectionIcon: vi.fn().mockReturnValue({}),
    createUserIcon: vi.fn().mockReturnValue({}),
    onMapClick: vi.fn(),
    onMarkerDragEnd: vi.fn(),
    setView: vi.fn(),
    getUserLocation: vi.fn().mockResolvedValue({ lat: 41.4, lng: 2.19 }),
    destroyMap: vi.fn(),
  };

  const mockEventsService = {
    events: signal([]),
    mapFilteredEvents: signal([]),
    selectedHobby: signal(''),
    hobbyList: ['Deporte', 'Música'],
    updateMapFilter: vi.fn(),
    loadEvents: vi.fn(),
  };

  const mockNavigationService = {
    setPreviousUrl: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [
        provideRouter([]),
        { provide: MapService, useValue: mockMapService },
        { provide: EventsService, useValue: mockEventsService },
        { provide: NavigationService, useValue: mockNavigationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;

    const div = document.createElement('div');
    div.id = component.containerId;
    document.body.appendChild(div);
  });

  afterEach(() => {
    const div = document.getElementById(component.containerId);
    if (div) div.remove();
    vi.clearAllMocks();
  });

  it('should create and initialize the map', async () => {
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(component).toBeTruthy();
    expect(mockMapService.initMap).toHaveBeenCalled();
  });

  it('should load events on init when mode is view', async () => {
    component.mode = 'view';
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockEventsService.loadEvents).toHaveBeenCalled();
  });

  it('should update filter when hobby changes', () => {
    const event = { target: { value: 'Música' } } as any;
    component.onHobbyChange(event);
    expect(mockEventsService.updateMapFilter).toHaveBeenCalledWith('Música');
  });
});
