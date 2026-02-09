import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { CalendarComponent } from './events/calendar/calendar';
import { EventsList } from './events/events-list/events-list';
import { EventForm } from './events/event-form/event-form';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

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

  {
    path: '',
    canActivate: [authGuard],
    children: [
        { path: 'events', component: EventsList } ,
        { path: 'events/new', component: EventForm },
        { path: 'events/:id/edit', component: EventForm },
        { path: 'calendar', component: CalendarComponent },
        { path: 'dashboard', component: Dashboard },
        //...falta MAPA
    ]
  },

  {
    path: '**',
    redirectTo: '',
  }


];
