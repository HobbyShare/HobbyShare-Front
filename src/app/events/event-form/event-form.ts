
import { CreateEventDto, EventModel } from './../../core/modals/event-model';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { form, required, FormField, readonly, disabled } from '@angular/forms/signals';
import { Hobby } from '../../core/enums/hobby.enum';

@Component({
  selector: 'app-event-form',
  imports: [FormField],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm implements OnInit {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  buttonSubmitClicked = signal<boolean>(false);
  eventId = signal<string | null>(null);
  isEditMode = computed(() => !!this.eventId());
  isLoadingEvent = signal(false);

  hobbies = Object.values(Hobby);

  eventFormModel = signal<CreateEventDto>({
    title: '',
    description: '',
    hobby: '',
    date: '',
    lat: 0,
    lng: 0,
  });

  createEventForm = form(this.eventFormModel, (path) => {
    required(path.title, { message: 'El título es obligatorio' });
    required(path.description, { message: 'La descripción es obligatoria' });
    required(path.hobby, { message: 'El hobby es obligatorio' });
    required(path.date, { message: 'La fecha es obligatoria' });
    required(path.lat, { message: 'La latitud es obligatoria' });
    required(path.lng, { message: 'La longitud es obligatoria' });
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
        this.eventFormModel.set({
          title: event.title,
          description: event.description,
          hobby: Array.isArray(event.hobby) ? event.hobby[0] : event.hobby,
          date: event.date,
          lat: event.lat,
          lng: event.lng,
        });

        this.isLoadingEvent.set(false);
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.isLoadingEvent.set(false);
        this.router.navigate(['/events']);
      }
    });
  }

  onSubmitEventForm(): void {
    this.buttonSubmitClicked.set(true);

    if (!this.createEventForm().valid()) {
      return;
    }

    const formData = this.eventFormModel();
    const eventData: CreateEventDto = {
      ...formData,
      date: formData.date,
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
      }
    });
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.eventFormModel.update(model => ({
      ...model,
      hobby: target.value
    }));
  }

  get pageTitle(): string {
    return this.isEditMode() ? 'Editar Evento' : 'Crear Evento';
  }

  get submitButtonText(): string {
    return this.isEditMode() ? 'Guardar cambios' : 'Crear evento';
  }
}
