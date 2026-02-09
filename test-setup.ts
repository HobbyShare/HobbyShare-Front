// src/test-setup.ts
// Configuración global para todos los tests con Vitest en Angular 21

import '@angular/compiler';
import { afterEach } from 'vitest';

/**
 * 🎯 Setup del TestBed para aplicaciones Zoneless (Angular 21)
 *
 * Angular 21 usa zoneless change detection por defecto.
 * No necesitamos importar zone.js en los tests.
 */

// Si necesitas soporte para snapshots (opcional)
// import '@analogjs/vitest-angular/setup-snapshots';

/**
 * 🔧 Configuración global de mocks si es necesario
 */

// Mock de localStorage (si tus componentes lo usan)
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock de sessionStorage (si tus componentes lo usan)
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

/**
 * 🌍 Mock de window.matchMedia (para tests que usan media queries)
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

/**
 * 🗺️ Mock de navigator.geolocation (para tests del mapa)
 */
const mockGeolocation = {
  getCurrentPosition: (success: PositionCallback) => {
    const position: GeolocationPosition = {
      coords: {
        latitude: 41.40237282641176,
        longitude: 2.194541858893481,
        accuracy: 100,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      } as GeolocationCoordinates,
      timestamp: Date.now(),
      toJSON: () => ({
        latitude: 41.40237282641176,
        longitude: 2.194541858893481,
        accuracy: 100,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      }),
    };
    success(position);
  },
  watchPosition: () => 1,
  clearWatch: () => {},
};

Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
  configurable: true,
});

/**
 * 🎨 Mock de IntersectionObserver (para lazy loading, scroll, etc.)
 */
(globalThis as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
} as any;

/**
 * 📏 Mock de ResizeObserver (para componentes responsive)
 */
(globalThis as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

/**
 * 🎬 Mock de requestAnimationFrame (para animaciones)
 */
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    return window.setTimeout(() => callback(Date.now()), 16);
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (id: number) => {
    clearTimeout(id);
  };
}

/**
 * 🚨 Configuración de console para tests
 * Puedes comentar esto si quieres ver todos los logs durante el desarrollo
 */
// Silenciar warnings específicos en tests
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Filtrar warnings que no nos interesan en tests
  const warningStr = args[0]?.toString() || '';

  if (
    warningStr.includes('Navigation triggered outside Angular zone') ||
    warningStr.includes('NG0100')
  ) {
    return;
  }

  originalWarn.apply(console, args);
};

/**
 * 🧹 Cleanup después de cada test
 */
afterEach(() => {
  // Limpiar localStorage después de cada test
  localStorage.clear();
  sessionStorage.clear();

  // Limpiar timers (si usaste vi.useFakeTimers())
  // vi.useRealTimers();
});

/**
 * 📝 Notas importantes:
 *
 * 1. Este archivo se ejecuta ANTES de cada test
 * 2. NO uses fakeAsync o tick - no funcionan con Vitest zoneless
 * 3. Usa vi.useFakeTimers() para mocks de tiempo
 * 4. Usa await fixture.whenStable() en lugar de tick()
 * 5. Los mocks globales aquí afectan a TODOS los tests
 */
