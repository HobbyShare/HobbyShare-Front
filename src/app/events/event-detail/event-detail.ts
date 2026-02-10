import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../core/services/events.service';
import { AuthService } from '../../core/services/auth.service';
import { EventModel } from '../../core/modals/event-model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavigationService } from '../../core/services/navigation.service';

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
  private eventId = signal<string | null>(null);
  private navigationService = inject(NavigationService);

  event = computed(() => {
    const id = this.eventId();
    if (!id) return null;

    return this.eventsService.events().find(e => e._id === id) || null;
  });

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
    this.eventId.set(eventId);
    } else {
      this.router.navigate(['/events']);
    }
  }

  private loadEvent(id: string): void {
    // Si el evento no está en el servicio, lo descargamos
    const existingEvent = this.eventsService.events().find(e => e._id === id);
    if (!existingEvent) {
      this.isLoading.set(true);
      this.eventsService.getEventById(id).subscribe({
        next: (event) => {
          // Esto hará que el 'computed' de arriba se active.
          this.eventsService['_events'].update(events => [...events, event]);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  goToEdit(): void {
    const eventId = this.event()?._id;
    this.eventsService.navigateToEdit(eventId);
  }

  goBack(): void {
    const previousUrl = this.navigationService.getPreviousUrl();

    if (previousUrl) {
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigate(['/events']); // Fallback por si entran directos por URL
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
  }

  leaveEvent(): void {
    const event = this.event();
    const eventId = event?._id;

    if (!eventId) return;

    this.eventsService.handleLeaveEvent(event);
  }

  // HELPERS PARA EL TEMPLATE
  getMapUrl(): SafeResourceUrl {
    const event = this.event();
    if (!event) return '';

    const url = `https://maps.google.com/maps?q=${event.lat},${event.lng}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Fecha no disponible';

    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(dateString: string | undefined): string {
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
}
