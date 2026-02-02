import { Component, inject, OnInit, signal } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { EventModel } from '../../core/modals/event-model';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../core/modals/user-api';

@Component({
  selector: 'app-events-list',
  imports: [],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsList implements OnInit{
  eventsService = inject(EventsService);
  private router = inject(Router);

  events = signal<EventModel[]>([]);
  user = signal<User | null>(null);
  // currentPage = signal<number>(1);
  // totalPages = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.eventsService.loadEvents();
    this.user.set({
      id: '697e1e9d37015f6c49dd2c50', // El userId de tu token
      username: 'maca',
      name: 'Macarena',
      email: 'manolito@example.com',
      category: [],
      createdAt: new Date().toISOString()
    });

  }

  goToCreateEvent(): void {
    this.router.navigate(['/events/new']);
  }

  goToEditEvent(eventId: string | undefined): void {
    this.router.navigate(['/events', eventId, 'edit']);
  }

  goTodeleteEvent(event: EventModel | undefined): void {
    console.log('Creador evento: ', event?.creatorId);
    console.log('Id evento', event?._id);

    const currentUser = this.user();
  console.log('🔍 currentUser completo:', currentUser);
  console.log('🔍 currentUser.id:', currentUser?.id);
  console.log('🔍 event?.creatorId:', event?.creatorId);
  console.log('🔍 Comparación ===:', event?.creatorId === currentUser?.id);
  console.log('🔍 Tipos:', typeof event?.creatorId, typeof currentUser?.id);


    if (event?._id && currentUser && event?.creatorId === currentUser.id) {
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
console.log(id)
    const currentUser = this.user();
console.log('this.user', this.user()?.name)
    if(id && currentUser) {
      this.eventsService.joinEvent(id, currentUser.id);
    }
  }

  goToLeaveEvent(id: string | undefined): void {
console.log(id)
    const currentUser = this.user();
console.log('this.user', this.user()?.name)
    if(id && currentUser) {
      this.eventsService.leaveEvent(id);
    }
  }
}
