import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { EventModel } from '../../core/modals/event-model';
import { Router } from '@angular/router';
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

  events = this.eventsService.events;
  isLoading = this.eventsService.loading;
  error = this.eventsService.error;

  readonly Array = Array;

  ngOnInit(): void {
    this.eventsService.loadEvents();
  }

  goToCreateEvent(): void {
    this.router.navigate(['/events/new']);
  }

  goToEventDetail(eventId: string | undefined): void {
    this.eventsService.navigateToDetail(eventId);
  }

  goToEditEvent(eventId: string | undefined): void {
    this.eventsService.navigateToEdit(eventId);
  }

  deleteEvent(event: EventModel | undefined): void {
    this.eventsService.handleDeleteEvent(event || null);
  }

  joinEvent(event: EventModel | undefined): void {
    this.eventsService.handleJoinEvent(event || null);
  }

  leaveEvent(event: EventModel | undefined): void {
    this.eventsService.handleLeaveEvent(event || null);
  }

  // HELPERS
  isEventCreator(event: EventModel): boolean {
    return this.eventsService.isUserCreator(event);
  }

  canJoinEvent(event: EventModel): boolean {
    return this.eventsService.canUserJoin(event);
  }

  canLeaveEvent(event: EventModel): boolean {
    return this.eventsService.canUserLeave(event);
  }
}
