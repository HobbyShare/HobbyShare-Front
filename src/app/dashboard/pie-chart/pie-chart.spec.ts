import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartComponent } from './pie-chart';
import { EventsService } from '../../core/services/events.service';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(async () => {
    const mockEventsService = {
      loadEvents: () => {},
      getEventsByHobby: () => ({
        'Fútbol': 10
      })
    };

    await TestBed.configureTestingModule({
      imports: [PieChartComponent],
      providers: [
        { provide: EventsService, useValue: mockEventsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
