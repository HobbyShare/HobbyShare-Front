import { CreateEventDto, EventModel } from './../../core/modals/event-model';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { form, required, FormField } from '@angular/forms/signals';
import { Hobby } from '../../core/enums/hobby.enum';
import { LocationPickerModal } from '../location-picker-modal/location-picker-modal';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { DomSanitizer } from '@angular/platform-browser'; // <--- Importación clave
=======
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationService } from '../../core/services/navigation.service';
import { MapComponent } from '../map/map';
>>>>>>> refactor/styles

@Component({
  selector: 'app-event-form',
  standalone: true,
<<<<<<< HEAD
  imports: [FormField, LocationPickerModal, CommonModule],
=======
  imports: [FormField, LocationPickerModal, CommonModule, MapComponent],
>>>>>>> refactor/styles
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm implements OnInit {
<<<<<<< HEAD
  constructor(private sanitizer: DomSanitizer) {};
=======
  constructor(private sanitizer: DomSanitizer) {}
>>>>>>> refactor/styles

  private eventsService = inject(EventsService);
  private navigationService = inject(NavigationService);
  private route = inject(ActivatedRoute);
<<<<<<< HEAD
  router = inject(Router); // público para usarlo en el template
=======
  router = inject(Router);
>>>>>>> refactor/styles

  buttonSubmitClicked = signal<boolean>(false);
  eventId = signal<string | null>(null);
  isEditMode = computed(() => !!this.eventId());
  isLoadingEvent = signal(false);

<<<<<<< HEAD
  // Modal de selección de ubicación
=======
>>>>>>> refactor/styles
  isLocationModalOpen = signal(false);
  selectedLocation = signal<{ lat: number; lng: number } | null>(null);

  hobbies = Object.values(Hobby);

  eventFormModel = signal<CreateEventDto>({
    title: '',
    description: '',
    hobby: '',
    date: null as any,
    lat: 0,
    lng: 0,
  });

  // Nota: Cambiado de createEventForm() a createEventForm para que funcione con [formField]
  createEventForm = form(this.eventFormModel, (path) => {
    required(path.title, { message: 'El título es obligatorio' });
    required(path.description, { message: 'La descripción es obligatoria' });
    required(path.hobby, { message: 'El hobby es obligatorio' });
    required(path.date, { message: 'La fecha es obligatoria' });
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventId.set(id);

    if (this.isEditMode()) {
      this.loadEventForEdit();
    }
  }

  private loadEventForEdit(): void {
    this.isLoadingEvent.set(true);
    const id = this.eventId()!;
    this.eventsService.getEventById(id).subscribe({
      next: (event) => {
        const formattedDate = event.date ? new Date(event.date).toISOString().slice(0, 16) : '';
        this.eventFormModel.set({
          title: event.title,
          description: event.description,
          hobby: Array.isArray(event.hobby) ? event.hobby[0] : event.hobby,
          date: formattedDate.split('T')[0] as any,
          lat: event.lat,
          lng: event.lng,
        });

        this.selectedLocation.set({
          lat: event.lat,
          lng: event.lng,
        });

        // Actualizar la ubicación seleccionada para el preview
        this.selectedLocation.set({
          lat: event.lat,
          lng: event.lng,
        });

        this.isLoadingEvent.set(false);
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.isLoadingEvent.set(false);
        this.router.navigate(['/events']);
      },
    });
  }

  onSubmitEventForm(): void {
    this.buttonSubmitClicked.set(true);

    if (!this.createEventForm().valid()) {
      console.log('❌ Formulario inválido');
      return;
    }

<<<<<<< HEAD
    // Validar que se haya seleccionado una ubicación
=======
>>>>>>> refactor/styles
    const location = this.selectedLocation();
    if (!location || location.lat === 0 || location.lng === 0) {
      alert('Por favor, selecciona una ubicación en el mapa');
      return;
    }

    const formData = this.eventFormModel();
    const eventData: CreateEventDto = {
      ...formData,
      date: new Date(formData.date),
      lat: Number(formData.lat),
      lng: Number(formData.lng),
    };

    const request$ = this.isEditMode()
      ? this.eventsService.updateEvent(this.eventId()!, eventData)
      : this.eventsService.createEvent(eventData);

    request$.subscribe({
      next: () => {
        const action = this.isEditMode() ? 'actualizado' : 'creado';
        console.log(`✅ Evento ${action} con éxito`);
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error('❌ Error:', err);
      },
    });
  }

<<<<<<< HEAD
  // ============================================
  // GESTIÓN DEL MODAL DE UBICACIÓN
  // ============================================

=======
>>>>>>> refactor/styles
  openLocationPicker(): void {
    this.isLocationModalOpen.set(true);
  }

  onLocationConfirmed(coords: { lat: number; lng: number }): void {
    this.selectedLocation.set(coords);

<<<<<<< HEAD
    // Actualizar el formulario con las nuevas coordenadas
    this.eventFormModel.update(model => ({
=======
    this.eventFormModel.update((model) => ({
>>>>>>> refactor/styles
      ...model,
      lat: coords.lat,
      lng: coords.lng,
    }));

    console.log('📍 Ubicación confirmada:', coords);
  }

  onModalClosed(): void {
    this.isLocationModalOpen.set(false);
  }

  removeLocation(): void {
    this.selectedLocation.set(null);
<<<<<<< HEAD
    this.eventFormModel.update(model => ({
=======
    this.eventFormModel.update((model) => ({
>>>>>>> refactor/styles
      ...model,
      lat: 0,
      lng: 0,
    }));
  }

<<<<<<< HEAD
  // ============================================
  // HELPERS PARA EL TEMPLATE
  // ============================================

=======
>>>>>>> refactor/styles
  get hasLocation(): boolean {
    const location = this.selectedLocation();
    return !!location && location.lat !== 0 && location.lng !== 0;
  }

  get locationText(): string {
    const location = this.selectedLocation();
    if (!location || location.lat === 0) {
      return 'No seleccionada';
    }
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
  }

  getSafeUrl() {
    const lat = this.selectedLocation()?.lat;
    const lng = this.selectedLocation()?.lng;
    const url = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
<<<<<<< HEAD
=======
  }

  goBack(): void {
    const previousUrl = this.navigationService.getPreviousUrl();

    if (previousUrl) {
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigate(['/events']);
    }
>>>>>>> refactor/styles
  }
}

