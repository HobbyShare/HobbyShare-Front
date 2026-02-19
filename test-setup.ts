import 'zone.js';
import 'zone.js/testing';

import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { afterEach } from 'vitest';

// 2. INICIALIZAR el entorno de pruebas de Angular
// Esto es lo que permite que TestBed funcione con Vitest
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);



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
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});


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


(globalThis as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
} as any;


(globalThis as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;


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


const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const warningStr = args[0]?.toString() || '';

  if (
    warningStr.includes('Navigation triggered outside Angular zone') ||
    warningStr.includes('NG0100')
  ) {
    return;
  }

  originalWarn.apply(console, args);
};


afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

