import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../core/services/events.service';
import { AuthService } from '../../core/services/auth.service';
import { EventModel } from '../../core/modals/event-model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-event-detail',
  imports: [CommonModule],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetail implements OnInit {
  private eventsService = inject(EventsService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  event = signal<EventModel | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  isCreator = computed(() => this.eventsService.isUserCreator(this.event()));
  isParticipant = computed(() => this.eventsService.isUserParticipant(this.event()));
  canJoin = computed(() => this.eventsService.canUserJoin(this.event()));
  canLeave = computed(() => this.eventsService.canUserLeave(this.event()));

  currentUserId = computed(() => this.authService.currentUserId());

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');

    if (eventId) {
      this.loadEvent(eventId);
    } else {
      this.router.navigate(['/events']);
    }
  }

  private loadEvent(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.eventsService.getEventById(id).subscribe({
      next: (event) => {
        this.event.set(event);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.error.set('No se pudo cargar el evento');
        this.isLoading.set(false);
      }
    });
  }

  goToEdit(): void {
    const eventId = this.event()?._id;
    this.eventsService.navigateToEdit(eventId);
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/events']);
    }
  }

  deleteEvent(): void {
    const event = this.event();
    this.eventsService.handleDeleteEvent(event, () => {
      this.router.navigate(['/events']);
    });
  }

  joinEvent(): void {
    const event = this.event();
    const eventId = event?._id;

    if (!eventId) return;

    this.eventsService.handleJoinEvent(event);

    // Recargar el evento después de un delay para ver los cambios
    setTimeout(() => this.refreshCurrentEvent(), 300);
  }

  leaveEvent(): void {
    const event = this.event();
    const eventId = event?._id;

    if (!eventId) return;

    this.eventsService.handleLeaveEvent(event);

    // Recargar el evento después de un delay para ver los cambios
    setTimeout(() => this.refreshCurrentEvent(), 300);
  }

  // HELPERS PARA EL TEMPLATE
  getMapUrl(): SafeResourceUrl {
    const event = this.event();
    if (!event) return '';

    const url = `https://maps.google.com/maps?q=${event.lat},${event.lng}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  formatDate(dateString: Date | undefined): string {
    if (!dateString) return 'Fecha no disponible';

    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(dateString: Date | undefined): string {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getHobbyDisplay(): string {
    const hobby = this.event()?.hobby;
    return Array.isArray(hobby) ? hobby.join(', ') : hobby || 'N/A';
  }

  private refreshCurrentEvent(): void {
    const eventId = this.event()?._id;
    if (!eventId) return;

    this.eventsService.getEventById(eventId).subscribe({
      next: (updatedEvent) => {
        this.event.set(updatedEvent);
      },
      error: (err) => {
        console.error('Error recargando evento:', err);
      }
    });
}
}
