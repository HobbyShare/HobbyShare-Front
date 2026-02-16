import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  private authService = inject(AuthService);

  isAuthenticated = this.authService.isAuthenticated;

  isMenuOpen = signal(false);

  onLogout() {
    this.closeMenu();
    this.authService.logout();
  }

  toggleMenu() {
    this.isMenuOpen.update((value) => !value);
    if (this.isMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.isMenuOpen.set(false);
    document.body.style.overflow = '';
  }
}
