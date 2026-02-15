import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineChartComponent } from './line-chart';
import { UsersService } from '../../core/services/users.service';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    const mockUsersService = {
      loadUsers: () => {},
      getNewUsersByMonth: () => ({
        'Enero': 15
      })
    };

    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
      providers: [
        { provide: UsersService, useValue: mockUsersService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
