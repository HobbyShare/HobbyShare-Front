import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetail } from './event-detail';
import { EventsService } from '../../core/services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('EventDetail', () => {
  let component: EventDetail;
  let fixture: ComponentFixture<EventDetail>;
  let mockEventsService: any;
  let mockRouter: any;
  let eventsListSignal = signal<any[]>([]);
  const mockEvent = {
    _id: '123',
    title: 'Evento de Prueba',
    description: 'Descripción increíble',
    date: new Date().toISOString(),
    lat: 40.0,
    lng: -3.0,
    hobby: 'Programación',
    participants: [],
    creatorUser: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    eventsListSignal.set([]);

    mockEventsService = {
      events: eventsListSignal,
      _events: {
        update: vi.fn((updateFn) => {
          const currentEvents = eventsListSignal();
          eventsListSignal.set(updateFn(currentEvents));
        }),
      },

      isUserCreator: vi.fn(),
      isUserParticipant: vi.fn(),
      canUserJoin: vi.fn(),
      canUserLeave: vi.fn(),

      getEventById: vi.fn().mockReturnValue(of(mockEvent)),
      handleJoinEvent: vi.fn(),

      handleDeleteEvent: vi.fn((ev, navfunc) => {
        if (navfunc) navfunc();
        return of(true);
      }),

      navigateToEdit: vi.fn(),
    };
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EventDetail],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetail);
    component = fixture.componentInstance;

    component.isLoading.set(false);
    component.error.set(null);

    fixture.detectChanges();
  });

  it('should load and display event details on init', () => {
    const titleElement = fixture.debugElement.query(By.css('h1'));

    expect(titleElement.nativeElement.textContent).toContain(mockEvent.title);
    expect(fixture.nativeElement.textContent).toContain(mockEvent.description);
  });

  it('should show edit and delete buttons only for event creator', async () => {
    const id = '123';
    const eventData = {
      _id: id,
      title: 'Test',
      hobby: 'Coding',
      lat: 0,
      lng: -3,
      participants: [],
    };

    eventsListSignal.set([eventData]);

    (component as any).eventId.set(id);

    mockEventsService.isUserCreator.mockReturnValue(true);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const editBtn = fixture.nativeElement.querySelector('[data-testid="edit-btn"]');

    expect(editBtn).not.toBeNull();
    expect(editBtn.textContent).toContain('Editar');
  });

  it('should allow non-creator to join event', () => {
    mockEventsService.isUserParticipant.mockReturnValue(false);
    fixture.detectChanges();

    const joinBtn = fixture.nativeElement.querySelector('[data-testid="join-btn"]');
    joinBtn.click();

    expect(mockEventsService.handleJoinEvent).toHaveBeenCalled();
  });

  it('should delete event and navigate back when creator clicks delete', async () => {
    const id = '123';
    const fullMockEvent = {
      _id: id,
      title: 'Evento a borrar',
      participants: [],
      date: new Date().toISOString(),
      creatorUser: 'Admin',
      lat: 40,
      lng: -3,
    };

    eventsListSignal.set([fullMockEvent]);
    (component as any).eventId.set(id);
    mockEventsService.isUserCreator.mockReturnValue(true);

    fixture.detectChanges();
    await fixture.whenStable();

    component.deleteEvent();

    await fixture.whenStable();

    expect(mockEventsService.handleDeleteEvent).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/events']);
  });

  it('should display embedded map with event location', () => {
    const iframe = fixture.nativeElement.querySelector('iframe');

    expect(iframe).not.toBeNull();
    expect(iframe.src).toContain('40');
  });
});
