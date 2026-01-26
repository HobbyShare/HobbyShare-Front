import { Component, inject, OnInit, signal } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { EventModel } from '../../core/modals/event-model';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  // currentPage = signal<number>(1);
  // totalPages = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.eventsService.loadEvents();
  }

  goToCreateEvent(): void {
    this.router.navigate(['/form']);
  }

}
