import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { EventModel } from '../../core/modals/event-model';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { User } from '../../core/modals/user-api';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-events-list',
  imports: [],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsList implements OnInit{
  eventsService = inject(EventsService);
  private router = inject(Router);
  authService = inject(AuthService); // ⬅️ INYECTAR

  events = this.eventsService.events;

  user = signal<User | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  currentUserId = computed(() => this.authService.currentUserId());

  ngOnInit(): void {
    this.eventsService.loadEvents();
    console.log('🔍 User ID al cargar:', this.currentUserId()); // debug
  }

  goToCreateEvent(): void {
    this.router.navigate(['/events/new']);
  }

  goToEditEvent(eventId: string | undefined): void {
    this.router.navigate(['/events', eventId, 'edit']);
  }

  goTodeleteEvent(event: EventModel | undefined): void {

    if (event?._id && event?.creatorId === this.currentUserId()) {
      this.eventsService.deleteEventService(event._id).subscribe({
        next: () => {
          console.log('✅ Evento eliminado correctamente');
        },
        error: (err) => {
          console.error('❌ Error al eliminar:', err);
        }
      });
    }
  }

  goToJoinEvent(id: string | undefined): void {
    const currentUserId = this.currentUserId();
    const event = this.events().find(e => e._id === id);

    if (id && currentUserId && event && event.creatorId !== currentUserId) {
      this.eventsService.joinEvent(id);
    } else {
      console.warn("No puedes unirte a tu propio evento.");
    }
  }

  goToLeaveEvent(id: string | undefined): void {
    const currentUserId = this.currentUserId();
    const event = this.events().find(e => e._id === id);
    const isJoined = event?.participants.find(e => e === currentUserId);

    if(id && event && isJoined) {
      this.eventsService.leaveEvent(id);
    } else {
      console.warn("No puedes salir de un evento en el que no estás.");
    }
  }

  isEventCreator(event: EventModel): boolean {
    return event.creatorId === this.currentUserId();
  }

}
