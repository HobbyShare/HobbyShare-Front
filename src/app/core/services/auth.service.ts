import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:3000';

  isAuthenticated = signal<boolean>(false)
  currentUser = signal<string | null>(null)

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    const token = this.getToken()
      if (token) {
        this.isAuthenticated.set(true)
      }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, userData)
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((response: any) => {
        this.saveToken(response.access_token)
        this.isAuthenticated.set(true)
        this.currentUser.set(credentials.userName)
      })
    )
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token)
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  logout(): void {
    localStorage.removeItem('token')
    this.isAuthenticated.set(false)
    this.currentUser.set(null)
    this.router.navigate(['/login'])
  }

}
