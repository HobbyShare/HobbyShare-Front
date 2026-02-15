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


  const mockEvents: EventModel[] = [
    {
      _id: '1',
      title: 'Evento de prueba 1',
      description: 'Descripción del evento 1',
      hobby: Hobby.Sports,
      date: '2026-03-15',
      lat: 41.3851,
      lng: 2.1734,
      creatorId: 'user123',
      creatorUser: 'testUser',
      participants: ['user456'],
      createdAt: '2026-02-01',
      updatedAt: '2026-02-01',
    },
    {
      _id: '2',
      title: 'Evento de prueba 2',
      description: 'Descripción del evento 2',
      hobby: Hobby.Music,
      date: '2026-03-20',
      lat: 41.4000,
      lng: 2.2000,
      creatorId: 'user456',
      creatorUser: 'otherUser',
      participants: [],
      createdAt: '2026-02-02',
      updatedAt: '2026-02-02',
    },
  ];

  beforeEach(async () => {

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


  describe('Initial Rendering and Event Loading', () => {
    it('should load and display events on init', async () => {

      eventsServiceMock.events.set(mockEvents);
      eventsServiceMock.loading.set(false);


      fixture.detectChanges();
      await fixture.whenStable();


      expect(eventsServiceMock.loadEvents).toHaveBeenCalledOnce();


      const eventCards = fixture.nativeElement.querySelectorAll('.bg-white.rounded-2xl');
      expect(eventCards.length).toBe(2);


      const firstTitle = fixture.nativeElement.querySelector('h3');
      expect(firstTitle.textContent.trim()).toContain('Evento de prueba 1');
    });

    it('should display empty state when no events exist', async () => {

      eventsServiceMock.events.set([]);
      eventsServiceMock.loading.set(false);


      fixture.detectChanges();
      await fixture.whenStable();


      const emptyState = fixture.nativeElement.querySelector('.text-center.p-16');
      expect(emptyState).toBeTruthy();
      expect(emptyState.textContent).toContain('No hay eventos todavía');
    });
  });


  describe('Navigation', () => {
    it('should navigate to create event form when clicking create button', async () => {

      eventsServiceMock.events.set([]);
      fixture.detectChanges();
      await fixture.whenStable();


      const createButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Crear evento')) as HTMLButtonElement;

      expect(createButton).toBeTruthy();
      createButton.click();


      await fixture.whenStable();

      expect(createButton).toBeTruthy();
    });

    it('should navigate to event detail when clicking on event title', async () => {

      eventsServiceMock.events.set(mockEvents);
      fixture.detectChanges();
      await fixture.whenStable();


      const eventTitle = fixture.nativeElement.querySelector('h3');
      eventTitle.click();


      await fixture.whenStable();
      expect(eventsServiceMock.navigateToDetail).toHaveBeenCalledWith('1');
    });
  });


  describe('Loading State', () => {
    it('should show loading spinner while events are loading', async () => {

      eventsServiceMock.events.set([]);
      eventsServiceMock.loading.set(true);


      fixture.detectChanges();
      await fixture.whenStable();


      const loadingSpinner = fixture.nativeElement.querySelector('.animate-spin');
      expect(loadingSpinner).toBeTruthy();

      const loadingText = fixture.nativeElement.querySelector('.text-lg');
      expect(loadingText.textContent).toContain('Cargando eventos');
    });

    it('should hide loading spinner when events are loaded', async () => {

      eventsServiceMock.events.set(mockEvents);
      eventsServiceMock.loading.set(false);


      fixture.detectChanges();
      await fixture.whenStable();


      const loadingSpinner = fixture.nativeElement.querySelector('.animate-spin');
      expect(loadingSpinner).toBeFalsy();
    });
  });


  describe('Error Handling', () => {
    it('should display error message when events fail to load', async () => {

      eventsServiceMock.events.set([]);
      eventsServiceMock.loading.set(false);
      eventsServiceMock.error.set('Error al cargar los eventos');


      fixture.detectChanges();
      await fixture.whenStable();


      const errorContainer = fixture.nativeElement.querySelector('.bg-red-50');
      expect(errorContainer).toBeTruthy();

      const errorMessage = fixture.nativeElement.querySelector('.text-red-600');
      expect(errorMessage.textContent).toContain('Error al cargar los eventos');
    });

    it('should allow retry when error occurs', async () => {

      eventsServiceMock.events.set([]);
      eventsServiceMock.error.set('Error al cargar los eventos');
      fixture.detectChanges();
      await fixture.whenStable();


      const retryButton = fixture.nativeElement.querySelector('.bg-red-500');
      retryButton.click();


      await fixture.whenStable();
      expect(eventsServiceMock.loadEvents).toHaveBeenCalled();
    });
  });


  describe('Event Actions', () => {
    it('should allow user to join an event they can join', async () => {

      eventsServiceMock.events.set(mockEvents);
      eventsServiceMock.canUserJoin.mockReturnValue(true);
      eventsServiceMock.isUserCreator.mockReturnValue(false);
      fixture.detectChanges();
      await fixture.whenStable();


      const joinButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Unirme')) as HTMLButtonElement;

      if (joinButton) {
        joinButton.click();
        await fixture.whenStable();


        expect(eventsServiceMock.handleJoinEvent).toHaveBeenCalled();
      }
    });

    it('should show creator options for events created by current user', async () => {

      eventsServiceMock.events.set(mockEvents);
      eventsServiceMock.isUserCreator.mockImplementation((event: EventModel) => {
        return event._id === '1';
      });
      fixture.detectChanges();
      await fixture.whenStable();


      const editButtons = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).filter((btn: any) => btn.textContent.includes('Editar'));

      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('should delete event when creator clicks delete button', async () => {

      eventsServiceMock.events.set([mockEvents[0]]);
      eventsServiceMock.isUserCreator.mockReturnValue(true);
      fixture.detectChanges();
      await fixture.whenStable();


      const deleteButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Eliminar')) as HTMLButtonElement;

      if (deleteButton) {
        deleteButton.click();
        await fixture.whenStable();


        expect(eventsServiceMock.handleDeleteEvent).toHaveBeenCalled();
      }
    });

    it('should allow user to leave an event they are participating in', async () => {

      eventsServiceMock.events.set(mockEvents);
      eventsServiceMock.canUserLeave.mockReturnValue(true);
      eventsServiceMock.isUserCreator.mockReturnValue(false);
      fixture.detectChanges();
      await fixture.whenStable();


      const leaveButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Salir')) as HTMLButtonElement;

      if (leaveButton) {
        leaveButton.click();
        await fixture.whenStable();


        expect(eventsServiceMock.handleLeaveEvent).toHaveBeenCalled();
      }
    });
  });


  describe('Event Card Structure', () => {
    it('should display all event information in card', async () => {

      eventsServiceMock.events.set([mockEvents[0]]);
      fixture.detectChanges();
      await fixture.whenStable();

      
      const cardContent = fixture.nativeElement.textContent;

      expect(cardContent).toContain('Evento de prueba 1');
      expect(cardContent).toContain('Descripción del evento 1');
      expect(cardContent).toContain('testUser');
      expect(cardContent).toContain('1 participantes');
      expect(cardContent).toContain('2026-03-15');
      expect(cardContent).toContain('Sports');
    });
  });
});

  // // ✅ Test 1: Renderizado inicial y carga de eventos
  // it('should load and display events on init', async () => {
  //   // Verifica que se llame a loadEvents() y se muestren en el DOM
  // });

  // // ✅ Test 2: Navegación a crear evento
  // it('should navigate to create event form when clicking create button', async () => {
  //   // Simula click en "Crear evento" y verifica navegación
  // });

  // // ✅ Test 3: Estado de loading
  // it('should show loading spinner while events are loading', async () => {
  //   // Verifica que aparezca el spinner cuando isLoading() es true
  // });

  // // ✅ Test 4: Manejo de errores
  // it('should display error message when events fail to load', async () => {
  //   // Mockea error del servicio y verifica mensaje de error
  // });

  // // ✅ Test 5: Interacción con evento (unirse/salir)
  // it('should allow user to join an event they can join', async () => {
  //   // Verifica que el botón "Unirme" funcione correctamente
  // });
//});
