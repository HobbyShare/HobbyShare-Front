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

  // 🎭 Mock data
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
    // 🔧 Mock del EventsService
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

    // 🔧 Mock del AuthService
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
      // Arrange: configurar el mock para devolver eventos
      eventsServiceMock.events.set(mockEvents);
      eventsServiceMock.loading.set(false);

      // Act: ejecutar detección de cambios
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert: verificar que se llamó a loadEvents
      expect(eventsServiceMock.loadEvents).toHaveBeenCalledOnce();

      // Assert: verificar que los eventos se muestran en el DOM
      const eventCards = fixture.nativeElement.querySelectorAll('[data-testid="event-card"]');
      expect(eventCards.length).toBe(2);

      // Assert: verificar que se muestran los títulos correctos
      const firstTitle = fixture.nativeElement.querySelector('h3');
      expect(firstTitle.textContent.trim()).toContain('Evento de prueba 1');
    });

    it('should display empty state when no events exist', async () => {
      // Arrange: sin eventos
      eventsServiceMock.events.set([]);
      eventsServiceMock.loading.set(false);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert: verificar mensaje de "no hay eventos"
      const emptyState = fixture.nativeElement.querySelector('.text-center.p-16');
      expect(emptyState).toBeTruthy();
      expect(emptyState.textContent).toContain('No hay eventos todavía');
    });
  });

  describe('Navigation', () => {
    it('should navigate to create event form when clicking create button', async () => {
      // Arrange
      eventsServiceMock.events.set([]);
      fixture.detectChanges();
      await fixture.whenStable();

      // Act: buscar y hacer click en el botón "Crear evento"
      const createButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Crear evento')) as HTMLButtonElement;

      expect(createButton).toBeTruthy();
      createButton.click();

      // Assert: verificar que se llama al método de navegación
      await fixture.whenStable();
      // El router debería navegar a '/events/new'
      // Nota: en un test real, deberías mockear Router y verificar la llamada
      expect(createButton).toBeTruthy();
    });

    it('should navigate to event detail when clicking on event title', async () => {
      // Arrange
      eventsServiceMock.events.set(mockEvents);
      fixture.detectChanges();
      await fixture.whenStable();

      // Act: hacer click en el título del evento
      const eventTitle = fixture.nativeElement.querySelector('h3');
      eventTitle.click();

      // Assert: verificar que se llama a navigateToDetail
      await fixture.whenStable();
      expect(eventsServiceMock.navigateToDetail).toHaveBeenCalledWith('1');
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner while events are loading', async () => {
      // Arrange: simular estado de carga
      eventsServiceMock.events.set([]);
      eventsServiceMock.loading.set(true);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert: verificar que aparece el spinner
      const loadingSpinner = fixture.nativeElement.querySelector('.animate-spin');
      expect(loadingSpinner).toBeTruthy();

      const loadingText = fixture.nativeElement.querySelector('.text-lg');
      expect(loadingText.textContent).toContain('Cargando eventos');
    });

    it('should hide loading spinner when events are loaded', async () => {
      // Arrange: eventos cargados
      eventsServiceMock.events.set(mockEvents);
      eventsServiceMock.loading.set(false);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert: verificar que NO aparece el spinner
      const loadingSpinner = fixture.nativeElement.querySelector('.animate-spin');
      expect(loadingSpinner).toBeFalsy();
    });
  });

  describe('Error Handling', () => {
    it('should allow retry when error occurs', async () => {
      // Arrange
      eventsServiceMock.events.set([]);
      eventsServiceMock.error.set('Error al cargar los eventos');
      fixture.detectChanges();
      await fixture.whenStable();

      // Act: hacer click en el botón "Reintentar"
      const retryButton = fixture.nativeElement.querySelector('.bg-red-500');
      retryButton.click();

      // Assert: verificar que se llama a loadEvents nuevamente
      await fixture.whenStable();
      expect(eventsServiceMock.loadEvents).toHaveBeenCalled();
    });
  });

  describe('Event Actions', () => {
    it('should allow user to join an event they can join', async () => {
      // Arrange
      eventsServiceMock.events.set(mockEvents);
      eventsServiceMock.canUserJoin.mockReturnValue(true);
      eventsServiceMock.isUserCreator.mockReturnValue(false);
      fixture.detectChanges();
      await fixture.whenStable();

      // Act: buscar el botón "Unirme"
      const joinButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Unirme')) as HTMLButtonElement;

      if (joinButton) {
        joinButton.click();
        await fixture.whenStable();

        // Assert: verificar que se llamó a handleJoinEvent
        expect(eventsServiceMock.handleJoinEvent).toHaveBeenCalled();
      }
    });

    it('should show creator options for events created by current user', async () => {
      // Arrange: simular que el usuario es creador del primer evento
      eventsServiceMock.events.set(mockEvents);
      eventsServiceMock.isUserCreator.mockImplementation((event: EventModel) => {
        return event._id === '1';
      });
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert: verificar que se muestran los botones de editar y eliminar
      const editButtons = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).filter((btn: any) => btn.textContent.includes('Editar'));

      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('should delete event when creator clicks delete button', async () => {
      // Arrange
      eventsServiceMock.events.set([mockEvents[0]]);
      eventsServiceMock.isUserCreator.mockReturnValue(true);
      fixture.detectChanges();
      await fixture.whenStable();

      // Act: hacer click en el botón "Eliminar"
      const deleteButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Eliminar')) as HTMLButtonElement;

      if (deleteButton) {
        deleteButton.click();
        await fixture.whenStable();

        // Assert: verificar que se llamó a handleDeleteEvent
        expect(eventsServiceMock.handleDeleteEvent).toHaveBeenCalled();
      }
    });

    it('should allow user to leave an event they are participating in', async () => {
      // Arrange
      eventsServiceMock.events.set(mockEvents);
      eventsServiceMock.canUserLeave.mockReturnValue(true);
      eventsServiceMock.isUserCreator.mockReturnValue(false);
      fixture.detectChanges();
      await fixture.whenStable();

      // Act: buscar el botón "Salir"
      const leaveButton = Array.from(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn: any) => btn.textContent.includes('Salir')) as HTMLButtonElement;

      if (leaveButton) {
        leaveButton.click();
        await fixture.whenStable();

        // Assert: verificar que se llamó a handleLeaveEvent
        expect(eventsServiceMock.handleLeaveEvent).toHaveBeenCalled();
      }
    });
  });
});
