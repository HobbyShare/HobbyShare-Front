import { LoginComponent } from './login';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: any;

  beforeEach(async () => {
    const authServiceMock = {
      login: vi.fn(),
      getToken: vi.fn(),
      saveToken: vi.fn(),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should be valid when filled correctly', () => {
    component.loginForm.setValue({
      userName: 'testuser',
      password: 'password123',
    });

    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should require username', () => {
    const usernameControl = component.loginForm.get('userName');
    usernameControl?.setValue('');

    expect(usernameControl?.hasError('required')).toBeTruthy();
  });

  it('should require password', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');

    expect(passwordControl?.hasError('required')).toBeTruthy();
  });

  it('should call authService.login on submit', () => {
    const mockResponse = { access_token: 'test-token' };
    authService.login.mockReturnValue(of(mockResponse));

    component.loginForm.setValue({
      userName: 'testuser',
      password: 'password123',
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      userName: 'testuser',
      password: 'password123',
    });
  });
});
