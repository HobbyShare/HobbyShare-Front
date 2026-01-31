import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  errorMessage = signal('');

  loginForm = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Please, fulfill all the fields correctly');
      return;
    }
    this.errorMessage.set('');
  }
}
