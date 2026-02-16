import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar';
import { EventsService } from '../../core/services/events.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CalendarComponent - Tests Básicos', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [
        {
          provide: EventsService,
          useValue: {
            events: signal([]),
            loading: signal(false),
            error: signal(null),
            loadEvents: vi.fn(),
            deleteEventService: vi.fn(() => of({})),
            leaveEvent: vi.fn(),
            joinEvent: vi.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getUserId: vi.fn(() => 'user123'),
            isAuthenticated: signal(true),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar con selectedEvent null', () => {
    expect(component.selectedEvent()).toBeNull();
  });

  it('debe inicializar con showModal false', () => {
    expect(component.showModal()).toBe(false);
  });

  it('debe cargar eventos al inicializar', () => {
    const eventsService = TestBed.inject(EventsService);
    component.ngOnInit();
    expect(eventsService.loadEvents).toHaveBeenCalled();
  });

  it('debe tener opciones de calendario', () => {
    const options = component.options();
    expect(options).toBeDefined();
    expect(options.initialView).toBe('dayGridMonth');
  });
});
