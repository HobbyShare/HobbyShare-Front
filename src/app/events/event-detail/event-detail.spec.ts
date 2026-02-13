import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetail } from './event-detail';
import { EventsService } from '../../core/services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';

describe('EventDetail', () => {
  let component: EventDetail;
  let fixture: ComponentFixture<EventDetail>;
  let mockEventsService: any;
  let mockRouter: any;

  // Mock completo
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
    updatedAt: new Date().toISOString()
  };

  beforeEach(async () => {
    mockEventsService = {
      // Señales
      events: signal([mockEvent]),
      _events: { update: vi.fn() },
      isUserCreator: vi.fn().mockReturnValue(false),
      isUserParticipant: vi.fn().mockReturnValue(false),
      canUserJoin: vi.fn().mockReturnValue(true),
      canUserLeave: vi.fn().mockReturnValue(false),
      getEventById: vi.fn(),
      handleJoinEvent: vi.fn(),
      handleDeleteEvent: vi.fn((ev, cb) => cb()),
      navigateToEdit: vi.fn()
    };

    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EventDetail],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetail);
    component = fixture.componentInstance;

    // Estados de carga falsos para ver el contenido
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
    mockEventsService.isUserCreator.mockReturnValue(true);
    (component as any).eventId.set('123');
    fixture.detectChanges();
    await fixture.whenStable();

    const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const editBtn = allButtons.find(btn => btn.textContent?.includes('Editar'));

    if (!editBtn) {
      console.log("Botones encontrados:", allButtons.map(b => b.textContent?.trim()));
    }

    expect(editBtn?.textContent).toContain('Editar');
  })

  it.only('should allow non-creator to join event', () => {
    mockEventsService.isUserParticipant.mockReturnValue(false);
    fixture.detectChanges();

    const joinBtn = fixture.nativeElement.querySelector('[data-testid="join-btn"]');
    joinBtn.click();

    expect(mockEventsService.handleJoinEvent).toHaveBeenCalled();
  });

  it('should delete event and navigate back when creator clicks delete', () => {
    mockEventsService.isUserCreator.mockReturnValue(true);
    fixture.detectChanges();

    component.deleteEvent();

    expect(mockEventsService.handleDeleteEvent).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/events']);
  });

  it('should display embedded map with event location', () => {
    const iframe = fixture.nativeElement.querySelector('iframe');

    expect(iframe).not.toBeNull();
    expect(iframe.src).toContain('40');
  });
});
