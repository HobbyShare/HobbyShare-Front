import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MapService } from './map.service';
import * as L from 'leaflet';

describe('MapService', () => {
  // Declaramos la variable en el scope del describe
  let service: MapService;
  const containerId = 'map-test-container';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService],
    });

    // Inyectamos el servicio
    service = TestBed.inject(MapService);

    // Creamos un contenedor real en el DOM para que Leaflet pueda inicializarse
    const div = document.createElement('div');
    div.id = containerId;
    div.style.height = '100px';
    div.style.width = '100px';
    document.body.appendChild(div);
  });

  afterEach(() => {
    // Limpieza total después de cada test
    service.destroyMap(containerId);
    const div = document.getElementById(containerId);
    if (div) div.remove();
    vi.restoreAllMocks();
  });

  it('1. Debería existir el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('2. Debería inicializar un mapa y recuperarlo por ID', () => {
    const config = {
      containerId: containerId,
      center: [41.3851, 2.1734] as [number, number],
      zoom: 13,
    };

    const map = service.initMap(config);

    expect(map).toBeDefined();
    expect(service.getMap(containerId)).toBe(map);
  });

  it('3. Debería crear marcadores de eventos y filtrar los que tienen coordenadas (0,0)', () => {
    const map = service.initMap({ containerId, center: [0, 0], zoom: 1 });

    const mockEvents = [
      { title: 'Evento Válido', lat: 41.3, lng: 2.1, hobby: 'Deporte' },
      { title: 'Evento Inválido', lat: 0, lng: 0 },
      { title: 'Evento Incompleto', lat: null, lng: undefined }
    ];

    const markers = service.createEventMarkers(map, mockEvents);

    // Según tu lógica, solo el primero es válido
    expect(markers.length).toBe(1);
    expect(map.hasLayer(markers[0])).toBe(true);
  });

  it('4. Debería eliminar un mapa correctamente de la memoria', () => {
    service.initMap({ containerId, center: [0, 0], zoom: 1 });
    expect(service.getMap(containerId)).toBeDefined();

    service.destroyMap(containerId);
    expect(service.getMap(containerId)).toBeUndefined();
  });

  it('5. Debería obtener la ubicación del usuario mediante Promise', async () => {
    const mockCoords = {
      coords: { latitude: 40.4168, longitude: -3.7038 }
    };

    // Mockeamos la API global del navegador
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: vi.fn().mockImplementation((success) => success(mockCoords))
      }
    });

    const location = await service.getUserLocation();

    expect(location).toEqual({ lat: 40.4168, lng: -3.7038 });
  });
});
