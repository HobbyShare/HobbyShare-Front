import { Component, OnInit, signal, inject, effect } from '@angular/core';
import { CalendarOptions, EventInput, EventClickArg } from '@fullcalendar/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EventsService } from '../../core/services/events.service';
import dayGridPlugin from '@fullcalendar/daygrid'
import enLocale from '@fullcalendar/core/locales/en-gb';
import interactionPlugin from '@fullcalendar/interaction';
import { EventModel } from '../../core/modals/event-model';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';



@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule, DatePipe],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class CalendarComponent implements OnInit {

  private eventsService = inject(EventsService)
  private authService = inject(AuthService)
  private router = inject(Router)
  events = this.eventsService.events;
  isLoading = this.eventsService.loading;
  errorMessage = this.eventsService.error;
  selectedEvent = signal<EventModel | null>(null);
  showModal = signal(false);

  options = signal<CalendarOptions>({
      plugins: [dayGridPlugin, interactionPlugin],
      locale: enLocale,
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      events: [],
      eventClick: this.calendarClickEvent.bind(this),
      height: 'auto',
      editable: false,
      eventColor: '#3788d8'
    })

  constructor() {
    effect(() => {
      const currentEvents = this.events()
      if(currentEvents.length > 0) {
      this.formatEventsForCalendar(currentEvents)
    }
    })
  }


  ngOnInit(): void {

     this.eventsService.loadEvents()

  }


  formatEventsForCalendar(events: EventModel[]): void {

   const calendarEvents: EventInput[] = events.map(event => ({
    id: event._id,
    title: event.title,
    start: event.date,
    extendedProps: {
      description: event.description,
      // location: event.??
      participants: event.participants.length,
      creator: event.creatorUser,
      hobby: event.hobby,
    }
   }))

   this.options.update(options => ({
    ...options, events: calendarEvents
   }))
  }


  calendarClickEvent(clickInfo: EventClickArg): void {
    const eventId = clickInfo.event.id

    const event = this.events().find(e => e._id === eventId)

    if(event) {
      this.selectedEvent.set(event)
      this.openModal()
    }
  }

  openModal() {
    this.showModal.set(true)
    const modal = document.getElementById('event_modal') as HTMLDialogElement
    modal?.showModal()
  }

  closeModal() {
    this.showModal.set(false)
    this.selectedEvent.set(null)
    const modal = document.getElementById('event_modal') as HTMLDialogElement
    modal?.close()
  }

  isCreator(): boolean {
    const currentUserId = this.authService.getUserId()
    return this.selectedEvent()?.creatorId === currentUserId
  }

  isParticipant(): boolean {
    const currentUserId = this.authService.getUserId()
    const participantsEvent = this.selectedEvent()?.participants

    if(!currentUserId) {
      return false
    }

    return participantsEvent?.includes(currentUserId) || false
  }

  deleteEvent() : void {
    const eventId = this.selectedEvent()?._id
    if(!eventId) return


    if (confirm('Are you sure you want to delete this event?')) {
      this.eventsService.deleteEventService(eventId).subscribe({
        next: () => {
          this.closeModal();
          this.eventsService.loadEvents()
        },
        error: (err) => {
          alert('Error deleting the event')
        }

      })
    }
  }

  leaveEvent(): void {
    const eventId = this.selectedEvent()?._id
    if(!eventId) return

    this.eventsService.leaveEvent(eventId)
    this.closeModal()
  }

  joinEvent(): void {
    const eventId = this.selectedEvent()?._id
    if(!eventId) return

    this.eventsService.joinEvent(eventId)
    this.closeModal()
  }

}
