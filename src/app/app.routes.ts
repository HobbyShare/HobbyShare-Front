import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';

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
    path: '**',
    redirectTo: '',
  }
];
