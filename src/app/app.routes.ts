import { Routes } from '@angular/router';
import { Home } from './shared/home/home';
import { EventsList } from './events/events-list/events-list';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'list', component: EventsList }, // , canActivate: [authGuard]
  // { path: 'events/:id', component: FilmDetail, canActivate: [authGuard] },
  // { path: 'login', component: Login },
  // { path: 'register', component: Register},
  { path: "**", redirectTo: ''}
];
