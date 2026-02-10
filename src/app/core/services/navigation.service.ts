import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private previousUrl = signal<string | null>(null);

  setPreviousUrl(url: string) {
    this.previousUrl.set(url);
  }

  getPreviousUrl() {
    return this.previousUrl();
  }
}
