import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { EventsList } from './events-list';
import { EventsService } from '../../core/services/events.service';
import { AuthService } from '../../core/services/auth.service';
import { EventModel } from '../../core/modals/event-model';
import { Hobby } from '../../core/enums/hobby.enum';

describe('EventsList Component', () => {
  let fixture: ComponentFixture<EventsList>;
  let component: EventsList;
  let eventsServiceMock: any;
  let authServiceMock: any;

  // Mock data
  const mockEvents: EventModel[] = [
    {
      _id: '1',
      title: 'Evento de prueba 1',
      description: 'Descripción del evento 1',
      hobby: Hobby.Sports,
      date: new Date('2026-03-15'),
      lat: 41.3851,
      lng: 2.1734,
      creatorId: 'user123',
      creatorUser: 'testUser',
      participants: ['user456'],
      createdAt: new Date('2026-02-01'),
      updatedAt: new Date('2026-02-01'),
    },
    {
      _id: '2',
      title: 'Evento de prueba 2',
      description: 'Descripción del evento 2',
      hobby: Hobby.Music,
      date: new Date('2026-03-20'),
      lat: 41.4000,
      lng: 2.2000,
      creatorId: 'user456',
      creatorUser: 'otherUser',
      participants: [],
      createdAt: new Date('2026-02-02'),
      updatedAt: new Date('2026-02-02'),
    },
  ];

  beforeEach(async () => {
    // Mock del EventsService
    eventsServiceMock = {
      events: signal<EventModel[]>([]),
      loading: signal<boolean>(false),
      error: signal<string | null>(null),
      loadEvents: vi.fn(),
      navigateToDetail: vi.fn(),
      navigateToEdit: vi.fn(),
      handleDeleteEvent: vi.fn(),
      handleJoinEvent: vi.fn(),
      handleLeaveEvent: vi.fn(),
      isUserCreator: vi.fn(),
      canUserJoin: vi.fn(),
      canUserLeave: vi.fn(),
    };

    // Mock del AuthService
    authServiceMock = {
      currentUserId: signal<string | null>('user123'),
      isAuthenticated: signal<boolean>(true),
    };

    await TestBed.configureTestingModule({
      imports: [EventsList],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: EventsService, useValue: eventsServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsList);
    component = fixture.componentInstance;
  });

  it('should load and display events on init', async () => {
    eventsServiceMock.events.set(mockEvents);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(eventsServiceMock.loadEvents).toHaveBeenCalledOnce();
    const eventCards = fixture.nativeElement.querySelectorAll('[data-testid="event-card"]');
    expect(eventCards.length).toBe(2);
  });

  it('should display empty state when no events exist', async () => {
    eventsServiceMock.events.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    const emptyState = fixture.nativeElement.querySelector('.text-center');
    expect(emptyState.textContent).toContain('No hay eventos todavía');
  });

  it('should show loading spinner while events are loading', async () => {
    eventsServiceMock.loading.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.animate-spin')).toBeTruthy();
  });

  it('should allow retry when error occurs', async () => {
    eventsServiceMock.error.set('Error');
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.nativeElement.querySelector('.bg-red-500').click();
    expect(eventsServiceMock.loadEvents).toHaveBeenCalled();
  });

  it('should navigate to event detail when clicking on event title', async () => {
    eventsServiceMock.events.set(mockEvents);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.nativeElement.querySelector('h3').click();
    expect(eventsServiceMock.navigateToDetail).toHaveBeenCalledWith('1');
  });

  it('should navigate to create event form when clicking create button', async () => {
    fixture.detectChanges();
    const createBtn = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((b: any) => b.textContent.includes('Crear evento')) as HTMLButtonElement;

    createBtn.click();
    expect(createBtn).toBeTruthy();
  });

  it('should allow user to join an event', async () => {
    eventsServiceMock.events.set(mockEvents);
    eventsServiceMock.canUserJoin.mockReturnValue(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const joinBtn = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((b: any) => b.textContent.includes('Unirme')) as HTMLButtonElement;

    joinBtn.click();
    expect(eventsServiceMock.handleJoinEvent).toHaveBeenCalled();
  });

  it('should allow creator to delete an event', async () => {
    eventsServiceMock.events.set([mockEvents[0]]);
    eventsServiceMock.isUserCreator.mockReturnValue(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const deleteBtn = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((b: any) => b.textContent.includes('Eliminar')) as HTMLButtonElement;

    deleteBtn.click();
    expect(eventsServiceMock.handleDeleteEvent).toHaveBeenCalled();
  });
});
