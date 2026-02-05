import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { CalendarComponent } from './events/calendar/calendar';
import { EventsList } from './events/events-list/events-list';
import { EventForm } from './events/event-form/event-form';
import { PieChartComponent } from './dashboard/pie-chart/pie-chart';
import { BarChartComponent } from './dashboard/bar-chart/bar-chart';
import { LineChartComponent } from './dashboard/line-chart/line-chart';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'register',
    component: RegisterComponent,
  },


  { path: 'events', component: EventsList }, // , canActivate: [authGuard]
  { path: 'events/new', component: EventForm }, // , canActivate: [authGuard]
  { path: 'events/:id/edit', component: EventForm }, // , canActivate: [authGuard]

  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path: 'pie-chart',
    component: PieChartComponent,
  },

  {
    path: 'bar-chart',
    component: BarChartComponent,
  },

  {
    path: 'line-chart',
    component: LineChartComponent,
  },

  {
    path: '**',
    redirectTo: '',
  }


];
