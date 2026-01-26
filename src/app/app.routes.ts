import { Routes } from '@angular/router';
import { Home } from './shared/home/home';
import { EventsList } from './events/events-list/events-list';
import { EventForm } from './events/event-form/event-form';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'list', component: EventsList }, // , canActivate: [authGuard]
  { path: 'form', component: EventForm }, // , canActivate: [authGuard]
  // { path: 'events/:id', component: FilmDetail, canActivate: [authGuard] },
  // { path: 'login', component: Login },
  // { path: 'register', component: Register},
  { path: "**", redirectTo: ''}
];
