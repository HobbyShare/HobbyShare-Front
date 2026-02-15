import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userName: string;
  sub: string;
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:3000';

  isAuthenticated = signal<boolean>(false)
  currentUser = signal<string | null>(null)
  currentUserId = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    const token = this.getToken()
      if (token) {
        this.isAuthenticated.set(true)
        this.loadUserFromToken(token);
      }
  }

  private loadUserFromToken(token: string): void {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.currentUser.set(decoded.userName);
      this.currentUserId.set(decoded.sub);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
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
        this.loadUserFromToken(response.access_token);

      })
    )
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token)
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  getUserId(): string | null {
    return this.currentUserId();
  }

  logout(): void {
    localStorage.removeItem('token')
    this.isAuthenticated.set(false)
    this.currentUser.set(null)
    this.currentUserId.set(null);
    this.router.navigate(['/login'])
  }

}


