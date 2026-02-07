import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventModel, CreateEventDto } from '../modals/event-model';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = 'http://localhost:3000/events';

  private _events = signal<EventModel[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  events = this._events.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  eventsCount = computed(() => this._events().length);

  constructor(private http: HttpClient) {}

  loadEvents(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<EventModel[]>(this.apiUrl).subscribe({
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

  getEventById(id: string): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Error getting event:', err);
        this._error.set('Error al obtener el evento');
        return throwError(() => err);
      })
    );
  }

  createEvent(eventDto: CreateEventDto): Observable<EventModel> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<EventModel>(this.apiUrl, eventDto).pipe(
      tap((newEvent) => {
        this._events.update(events => [...events, newEvent]);
        this._loading.set(false);
      }),
      catchError((err) => {
        console.error('Error creating event:', err);
        this._error.set('Error al crear el evento');
        this._loading.set(false);
        return throwError(() => err);
      })
    );
  }

  updateEvent(id: string, eventDto: CreateEventDto): Observable<EventModel> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.put<EventModel>(`${this.apiUrl}/${id}`, eventDto).pipe(
      tap((updatedEvent) => {
        this._events.update(events =>
          events.map(e => e._id === id ? updatedEvent : e)
        );
        this._loading.set(false);
      }),
      catchError((err) => {
        console.error('Error updating event:', err);
        this._error.set('Error al actualizar el evento');
        this._loading.set(false);
        return throwError(() => err);
      })
    );
  }

deleteEventService(id: string): Observable<void> {
  this._loading.set(true);
  this._error.set(null);

  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    tap(() => {
      this._events.update(events => events.filter(e => e._id !== id));
      this._loading.set(false);
    }),
    catchError((err) => {
      console.error('Error deleting event:', err);
      this._error.set('Error al eliminar el evento');
      this._loading.set(false);
      return throwError(() => err);
    })
  );
}
  joinEvent(id: string): void {
    this.http.post<EventModel>(`${this.apiUrl}/${id}/join`, {}).subscribe({
      next: (updatedEvent) => {
        this._events.update(events =>
          events.map(e => e._id === id ? updatedEvent : e)
        );
      },
      error: (err) => {
        console.error('Error joining event:', err);
        this._error.set('Error al apuntarse al evento');
      }
    });
  }

  leaveEvent(id: string): void {
    this.http.delete<EventModel>(`${this.apiUrl}/${id}/leave`).subscribe({
      next: (updatedEvent) => {
        this._events.update(events =>
          events.map(e => e._id === id ? updatedEvent : e)
        );
      },
      error: (err) => {
        console.error('Error leaving event:', err);
        this._error.set('Error al salirse del evento');
      }
    });
  }

  clearError(): void {
    this._error.set(null);
  }

  getEventsByHobby()  {
    const events = this._events()
    const counts: any = {}

    events.forEach(event => {
      const hobby = event.hobby
      counts[hobby] = (counts[hobby] || 0) + 1
      });


    return counts
  }

  getEventsByMonth() {
    const events = this._events()
    const counts = events.reduce((acc: any, event: EventModel) => {

      const dateEvent = new Date(event.date)

      let month = dateEvent.toLocaleString('en-EN', { month: 'long' })

      month = month.charAt(0).toUpperCase() + month.slice(1)

      acc[month] = ( acc[month] || 0 ) + 1

      return acc

    }, {})

    return counts

  }
}
