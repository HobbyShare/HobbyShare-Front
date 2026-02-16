import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventForm } from './event-form';
import { EventsService } from '../../core/services/events.service';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Hobby } from '../../core/enums/hobby.enum';
import { signal } from '@angular/core';

describe('EventForm', () => {
  let component: EventForm;
  let fixture: ComponentFixture<EventForm>;
  let mockEventsService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockEventsService = {
      getEventById: vi
        .fn()
        .mockReturnValue(
          of({ title: 'Cena', date: '2026-10-10', lat: 10, lng: 10, hobby: Hobby.Sports }),
        ),
      createEvent: vi.fn().mockReturnValue(of({})),
      updateEvent: vi.fn().mockReturnValue(of({})),
      events: signal([]),
    };

    mockRouter = {
      navigate: vi.fn(),
      navigateByUrl: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EventForm],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(null) } } }, 
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect create mode if no ID is present', () => {
    expect(component.isEditMode()).toBe(false);
  });

  it('should be invalid when fields are empty', () => {
    component.onSubmitEventForm();
    fixture.detectChanges();

    expect(component.createEventForm().valid()).toBe(false);
    expect(mockEventsService.createEvent).not.toHaveBeenCalled();
  });

  it('should not submit if no location is selected', () => {
    component.eventFormModel.set({
      title: 'Título Test',
      description: 'Desc',
      hobby: Hobby.Sports,
      date: '2026-10-10' as any,
      lat: 0,
      lng: 0,
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.onSubmitEventForm();

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('ubicación'));
    expect(mockEventsService.createEvent).not.toHaveBeenCalled();
  });

  it('should call createEvent and navigate on success', async () => {
    component.eventFormModel.set({
      title: 'Nuevo Evento',
      description: 'Descripción',
      hobby: Hobby.Sports,
      date: '2026-10-10' as any,
      lat: 40.41,
      lng: -3.7,
    });
    component.selectedLocation.set({ lat: 40.41, lng: -3.7 });

    component.onSubmitEventForm();

    expect(mockEventsService.createEvent).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/events']);
  });

  it('should call updateEvent when in edit mode', async () => {
    component.eventId.set('789');
    component.selectedLocation.set({ lat: 10, lng: 10 });

    component.eventFormModel.set({
      title: 'Editado',
      description: 'Desc',
      hobby: Hobby.Sports,
      date: '2026-10-10' as any,
      lat: 10,
      lng: 10,
    });

    component.onSubmitEventForm();

    expect(mockEventsService.updateEvent).toHaveBeenCalledWith('789', expect.any(Object));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/events']);
  });
});
