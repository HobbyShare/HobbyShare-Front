import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from "../modals/user-api";
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private apiUrl = environment.apiUrl + '/users';
  private http = inject(HttpClient)
  private authService = inject(AuthService)
  private _users = signal<User[]>([])
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  user = this._users.asReadonly()
  loading = this._loading.asReadonly()
  error = this._error.asReadonly()

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken()
    return new HttpHeaders ({
      'Authorization': `Bearer ${token}`
    })
  }


  loadUsers(): void {
      this._loading.set(true);
      this._error.set(null);

      this.http.get<User[]>(this.apiUrl, {headers: this.getHeaders() }).subscribe({
        next: (users) => {
          this._users.set(users);
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set('Error loading users');
          this._loading.set(false);
        }
      });
    }

   getNewUsersByMonth() {
    const users = this._users()
    const counts = users.reduce((acc: any, user: User) => {

      const date = new Date(user.createdAt)
      let month = date.toLocaleString( 'en-EN', {month: 'long'})

      month = month.charAt(0).toUpperCase() + month.slice(1)

      acc[month] = ( acc[month] || 0) + 1

      return acc
    }, {} )

    return counts
  }
}
