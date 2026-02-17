import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart';
import { EventsService } from '../../core/services/events.service';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async () => {
    const mockEventsService = {
      loadEvents: () => {},
      getEventsByMonth: () => ({
        'Enero': 5,
        'Febrero': 8
      })
    };

    await TestBed.configureTestingModule({
      imports: [BarChartComponent],
      providers: [
        { provide: EventsService, useValue: mockEventsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
