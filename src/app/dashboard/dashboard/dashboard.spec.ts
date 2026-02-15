import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { PieChartComponent } from '../pie-chart/pie-chart';
import { BarChartComponent } from '../bar-chart/bar-chart';
import { LineChartComponent } from '../line-chart/line-chart';
import { EventsService } from '../../core/services/events.service';
import { UsersService } from '../../core/services/users.service';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    const mockEventsService = {
      loadEvents: () => {},
      getEventsByMonth: () => ({}),
      getEventsByHobby: () => ({}),
    };

    const mockUsersService = {
      loadUsers: () => {},
      getNewUsersByMonth: () => ({}),
    };

    await TestBed.configureTestingModule({
      imports: [Dashboard, PieChartComponent, BarChartComponent, LineChartComponent],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
