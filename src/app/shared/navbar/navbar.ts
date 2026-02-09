import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {

  private authService = inject(AuthService)

  isAuthenticated = this.authService.isAuthenticated

  onLogout() {

    this.authService.logout()

  }



}
