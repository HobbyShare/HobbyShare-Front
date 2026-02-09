// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { EventForm } from './event-form';

// describe('EventForm', () => {
//   let component: EventForm;
//   let fixture: ComponentFixture<EventForm>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [EventForm]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(EventForm);
//     component = fixture.componentInstance;
//     await fixture.whenStable();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   // ✅ Test 1: Modo creación vs edición
//   it('should initialize in create mode when no eventId provided', () => {
//     // Verifica que isEditMode() sea false
//   });

//   it('should load event data in edit mode', async () => {
//     // Verifica que cargue datos del evento al editar
//   });

//   // ✅ Test 2: Validación de formulario
//   it('should show validation errors when form is invalid', async () => {
//     // Submit sin llenar campos y verifica mensajes de error
//   });

//   // ✅ Test 3: Selección de ubicación (crítico)
//   it('should require location selection before submit', async () => {
//     // Intenta submit sin ubicación y verifica alerta
//   });

//   // ✅ Test 4: Crear evento exitosamente
//   it('should create event and navigate to events list on success', async () => {
//     // Llena formulario válido y verifica creación + navegación
//   });

//   // ✅ Test 5: Actualizar evento
//   it('should update event when in edit mode', async () => {
//     // En modo edición, verifica que llame a updateEvent
//   });
// });
