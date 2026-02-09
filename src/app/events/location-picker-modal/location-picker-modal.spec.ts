import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPickerModal } from './location-picker-modal';

describe('LocationPickerModal', () => {
  let component: LocationPickerModal;
  let fixture: ComponentFixture<LocationPickerModal>;

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
  });

  // ✅ Test 1: Apertura y cierre del modal
  it('should show modal when isOpen is true', () => {
    // Verifica que el modal se renderice cuando isModalOpen devuelve true
  });

  it('should close modal when clicking backdrop', async () => {
    // Simula click en el backdrop y verifica que emita modalClosed
  });

  // ✅ Test 2: Selección de ubicación
  it('should update selected location when map emits locationSelected', async () => {
    // Verifica que selectedLocation se actualice
  });

  // ✅ Test 3: Confirmación de ubicación
  it('should emit locationConfirmed when confirming valid location', async () => {
    // Selecciona ubicación y confirma, verifica evento emitido
  });

  // ✅ Test 4: Validación (ubicación no seleccionada)
  it('should show alert when confirming without selecting location', async () => {
    // Intenta confirmar sin seleccionar y verifica alerta
  });
});
