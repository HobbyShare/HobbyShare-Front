import { routes } from './../../app.routes';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Hobby } from '../../core/enums/hobby.enum';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService)
  private router = inject(Router)
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false)

  public readonly Hobby = Hobby

  public hobbyList = Object.values(Hobby)

  selectedHobbies = signal<string[]>([])


  registerForm = this.fb.group({
      userName: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }
  );

  toggleHobby(hobby: string): void {
    const current = this.selectedHobbies()
    const index = current.indexOf(hobby)

    if(index === -1) {
      this.selectedHobbies.set([...current, hobby])
    } else {
      this.selectedHobbies.set(current.filter(h => h !== hobby))
    }
  }

  isHobbySelected(hobby: string): boolean {
    return this.selectedHobbies().includes(hobby)
  }

  onSubmit(): void {

    this.errorMessage.set('')
    this.successMessage.set('')

    if(this.registerForm.invalid) {
      this.errorMessage.set('Please, fulfill all the fields')
      return
    }

    if(this.selectedHobbies().length === 0) {
      this.errorMessage.set('Please, choose at least one hobby')
      return
    }

    const password = this.registerForm.value.password
    const confirmPassword = this.registerForm.value.confirmPassword

    if(password !== confirmPassword) {
      this.errorMessage.set('Password does not match')
    }

    



  }


}
