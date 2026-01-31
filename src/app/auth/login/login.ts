import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage = signal('');
  isLoading = signal(false)

  loginForm = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {

    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      this.errorMessage.set('Please, fulfill all the fields correctly');
      return;
    }

    const credentials = {
      userName: this.loginForm.value.userName,
      password: this.loginForm.value.password,
    }

    this.isLoading.set(true)

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading.set(true)
        this.router.navigate(['/home']) //de momento ponemos home, pero probablemente vaya a Events
      },
      error: (error) => {
        this.isLoading.set(false)
        this.errorMessage.set('Error in login')
      }
    })


    this.errorMessage.set('');
  }
}
