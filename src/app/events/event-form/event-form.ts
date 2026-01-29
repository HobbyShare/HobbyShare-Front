import { CreateEventDto, EventModel } from './../../core/modals/event-model';
import { Component, inject, signal } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { form, required, FormField } from '@angular/forms/signals';
import { Hobby } from '../../shared/enums/hobby.enum';
// import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-event-form',
  imports: [FormField],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  buttonSubmitClicked = signal<boolean>(false);

  hobbies = Object.values(Hobby);

  eventFormModel = signal<CreateEventDto>({
    title: '',
    description: '',
    hobby: '',
    date: '',
    lat: 0,
    lng: 0,
  })

  createEventForm = form(this.eventFormModel, (path) => {
    required(path.title, {message: 'El título es obligatorio'});
    required(path.description, {message: 'La descripción es obligatoria'});
    required(path.hobby, {message: 'El hobby es obligatorio'});
    required(path.date, {message: 'La fecha es obligatoria'});
    required(path.lat, {message: 'La latitud es obligatoria'});
    required(path.lng, {message: 'La longitud es obligatoria'});
  });

  onSubmitEventForm(): void {
    this.buttonSubmitClicked.set(true);

    if (this.createEventForm().valid()) {
      const formData = this.eventFormModel();
      const eventData: CreateEventDto = {
        ...formData,
        date: formData.date, // debe ser format aaaa-mm-dd
        lat: Number(formData.lat),
        lng: Number(formData.lng),
      };

      this.eventsService.createEvent(eventData);
      if (!this.eventsService.error()) {
        console.log('✅ Evento creado con éxito');
        this.router.navigate(['/list']);
      } else {
        console.log(this.eventsService.error())
      }
    }
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.eventFormModel.update(model => ({
      ...model,
      hobby: target.value
  }));
}

}
