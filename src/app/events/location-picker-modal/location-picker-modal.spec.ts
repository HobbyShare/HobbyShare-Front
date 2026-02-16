import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD

import { LocationPickerModal } from './location-picker-modal';
=======
import { LocationPickerModal } from './location-picker-modal';
import { Component, EventEmitter, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { MapService } from '../../core/services/map.service';

@Component({
  selector: 'app-map',
  template: '',
  standalone: true,
})
class MockMapComponent {
  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();
}
>>>>>>> refactor/styles

describe('LocationPickerModal', () => {
  let component: LocationPickerModal;
  let fixture: ComponentFixture<LocationPickerModal>;
<<<<<<< HEAD

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationPickerModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationPickerModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
=======
  const mockMapService = {
    initMap: vi.fn(),
    destroyMap: vi.fn(),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationPickerModal, MockMapComponent],
      providers: [{ provide: MapService, useValue: mockMapService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationPickerModal);
    component = fixture.componentInstance;

    component.isOpen = signal(true);
    fixture.detectChanges();
  });

  it('should be visible when isOpen signal is true', () => {
    expect(component.isModalOpen).toBe(true);

    const modalContainer = fixture.nativeElement.querySelector('.fixed');
    expect(modalContainer).not.toBeNull();
  });

  it('should update selectedLocation when map emits coordinates', () => {
    const coords = { lat: 40.41, lng: -3.7 };

    component.onLocationSelected(coords);

    expect(component.selectedLocation()).toEqual(coords);
  });

  it('should emit locationConfirmed and close when a location is selected', () => {
    const coords = { lat: 10, lng: 20 };
    const emitSpy = vi.spyOn(component.locationConfirmed, 'emit');
    const closeSpy = vi.spyOn(component, 'closeModal');

    component.selectedLocation.set(coords);
    component.confirmLocation();

    expect(emitSpy).toHaveBeenCalledWith(coords);
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should show alert if confirming without selecting a location', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.selectedLocation.set(null);
    component.confirmLocation();

    expect(alertSpy).toHaveBeenCalled();
    expect(component.locationConfirmed.emit).not.toBeDefined;
  });

  it('should reset selectedLocation and emit modalClosed when closing', () => {
    const closeEmitSpy = vi.spyOn(component.modalClosed, 'emit');
    component.selectedLocation.set({ lat: 5, lng: 5 });

    component.closeModal();

    expect(component.selectedLocation()).toBeNull();
    expect(component.isOpen()).toBe(false);
    expect(closeEmitSpy).toHaveBeenCalled();
>>>>>>> refactor/styles
  });
});
