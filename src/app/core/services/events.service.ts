import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event, CreateEventDto } from '../../core/modals/event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = 'http://localhost:3000/events';

  private _events = signal<Event[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  events = this._events.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  eventsCount = computed(() => this._events().length);  // cantidad de eventos

  constructor(private http: HttpClient) {}

  loadEvents(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Event[]>(this.apiUrl).subscribe({
      next: (events) => {
        this._events.set(events);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this._error.set('Error al cargar los eventos');
        this._loading.set(false);
      }
    });
  }

  createEvent(eventDto: CreateEventDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.post<Event>(this.apiUrl, eventDto).subscribe({
      next: (newEvent) => {
        this._events.update(events => [...events, newEvent]);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error creating event:', err);
        this._error.set('Error al crear el evento');
        this._loading.set(false);
      }
    });
  }


  clearError(): void {
    this._error.set(null);  // Limpiar errores
  }
}
