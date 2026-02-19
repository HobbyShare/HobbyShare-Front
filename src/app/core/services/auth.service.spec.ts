import { it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting  } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

describe('Auth', () => {
  let service: AuthService;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save token to localStorage', () => {
    const token = 'test-token'
    service.saveToken(token)

    expect(localStorage.getItem('token')).toBe(token)
  })

  it('should get token from localStorage', () => {
    const token = 'test-token'
    localStorage.setItem('token', token)

    expect(service.getToken()).toBe(token)
  })

  it('should make POST request on login', () => {
    const mockResponse = { access_token: 'test-token'}
    const credentials = { userName: 'test', password: 'test123'}

    service.login(credentials).subscribe(response => {
      expect(response.access_token).toBe('test-token')
    })

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`)
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  })

   it('should clear token on logout', () => {
    localStorage.setItem('token', 'fake-token');
    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
  });

});
