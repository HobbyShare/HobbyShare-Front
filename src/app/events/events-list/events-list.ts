import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EventsService } from '../../core/services/events.service';
import { EventModel } from '../../core/modals/event-model';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NavigationService } from '../../core/services/navigation.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Hobby } from '../../core/enums/hobby.enum';


@Component({
  selector: 'app-events-list',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsList implements OnInit{
  eventsService = inject(EventsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private navigationService = inject(NavigationService);

  events = this.eventsService.events;
  isLoading = this.eventsService.loading;
  error = this.eventsService.error;

  readonly Array = Array;

  searchText = signal<string>('');
  selectedHobby = signal<string>('');
  sortBy = signal<'date' | null>(null);
  sortAscending = signal<boolean>(true);

  readonly Hobby = Hobby;
  hobbyList = ['', ...Object.values(Hobby)];


  filteredEvents = computed(() => {
    let events = this.events();
    const search = this.searchText().toLowerCase().trim();
    const hobby = this.selectedHobby();

    if (search) {
      events = events.filter(event =>
        event.title.toLowerCase().includes(search)
      );
    }

    if (hobby) {
      events = events.filter(event => {
        const eventHobby = Array.isArray(event.hobby) ? event.hobby[0] : event.hobby;
        return eventHobby === hobby;
      });
    }

    const sortType = this.sortBy();
    const ascending = this.sortAscending();

    if (sortType === 'date') {
      const eventsCopy = [...events];
      return eventsCopy.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        const comparison = dateA - dateB;
        return ascending ? comparison : -comparison;
      });
    }

    return events;
  });

  ngOnInit(): void {
    this.eventsService.loadEvents();

    this.route.queryParams.subscribe(params => {
      this.loadFiltersFromUrl(params);
    });
  }

  goToCreateEvent(): void {
    this.router.navigate(['/events/new']);
  }

  goToEventDetail(eventId: string | undefined): void {
    this.navigationService.setPreviousUrl(this.router.url);
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


  loadFiltersFromUrl(params: any): void {
    if (params['search']) {
      this.searchText.set(params['search']);
    }

    if (params['hobby']) {
      this.selectedHobby.set(params['hobby']);
    }

    if (params['sortBy']) {
      this.sortBy.set(params['sortBy']);
    }

    if (params['sortOrder']) {
      this.sortAscending.set(params['sortOrder'] === 'asc');
    }
  }

  updateURL(): void {
    const params: any = {};

    const search = this.searchText();
    if (search) {
      params['search'] = search;
    }

    const hobby = this.selectedHobby();
    if (hobby) {
      params['hobby'] = hobby;
    }

    const sortType = this.sortBy();
    if (sortType) {
      params['sortBy'] = sortType;
      params['sortOrder'] = this.sortAscending() ? 'asc' : 'desc';
    }

    this.router.navigate([], {
      queryParams: params,
      replaceUrl: true
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
    this.updateURL();
  }

  onHobbyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedHobby.set(select.value);
    this.updateURL();
  }

  toggleSort(type: 'date'): void {
    if (this.sortBy() === type) {
      this.sortAscending.update(value => !value);
    } else {
      this.sortBy.set(type);
      this.sortAscending.set(true);
    }
    this.updateURL();
  }


  isActiveSort(type: 'date'): boolean {
    return this.sortBy() === type;
  }

  getSortIcon(type: 'date'): string {
    if (!this.isActiveSort(type)) {
      return '⇅';
    }
    return this.sortAscending() ? '↑' : '↓';
  }


  clearFilters(): void {
    this.searchText.set('');
    this.selectedHobby.set('');
    this.sortBy.set(null);
    this.sortAscending.set(true);
    this.router.navigate([], {
      queryParams: {},
      replaceUrl: true
    });
  }

  
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
