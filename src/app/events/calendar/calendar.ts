import { Component, OnInit, signal, inject, effect } from '@angular/core';
import { CalendarOptions, EventInput, EventClickArg } from '@fullcalendar/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EventsService } from '../../core/services/events.service';
import dayGridPlugin from '@fullcalendar/daygrid'
import enLocale from '@fullcalendar/core/locales/en-gb';
import interactionPlugin from '@fullcalendar/interaction';
import { EventModel } from '../../core/modals/event-model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class CalendarComponent implements OnInit {

  private eventsService = inject(EventsService)
  private router = inject(Router)
  events = this.eventsService.events;
  isLoading = this.eventsService.loading;
  errorMessage = this.eventsService.error;

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


    // this.events.set([
    //   {
    //     title: 'Event 1',
    //     start: new Date(),
    //     description: 'Jugar al ping pong'
    //   },
    //   {
    //     title: 'Event 2',
    //     start: new Date(),
    //     description: 'Jugar al ping pong'
    //   },
    //   {
    //     title: 'Event 3',
    //     start: new Date(),
    //     description: 'Jugar al ping pong'
    //   },

    // ])

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

    this.router.navigate(['/events', eventId])
  }

}
