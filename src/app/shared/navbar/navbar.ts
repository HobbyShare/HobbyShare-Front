<<<<<<< HEAD
import { Component, inject, signal } from '@angular/core';
=======
import { Component, inject } from '@angular/core';
>>>>>>> 6687a7b5aeed55d6100e807748b4bfbafc63333b
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

<<<<<<< HEAD
  isMenuOpen = signal(false);

  onLogout() {
    this.closeMenu();
=======
  onLogout() {

>>>>>>> 6687a7b5aeed55d6100e807748b4bfbafc63333b
    this.authService.logout()

  }

<<<<<<< HEAD
toggleMenu() {
    this.isMenuOpen.update(value => !value);
    // Prevenir scroll cuando el menú está abierto
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

  
=======

>>>>>>> 6687a7b5aeed55d6100e807748b4bfbafc63333b

}
