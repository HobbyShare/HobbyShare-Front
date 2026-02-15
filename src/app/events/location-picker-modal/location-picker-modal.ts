import { Component, Output, EventEmitter, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map';

@Component({
  selector: 'app-location-picker-modal',
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: './location-picker-modal.html',
  styleUrl: './location-picker-modal.css',
})
export class LocationPickerModal {
  @Input() isOpen: any = signal(false);
  @Input() initialCoords?: { lat: number; lng: number };

  @Output() locationConfirmed = new EventEmitter<{ lat: number; lng: number }>();
  @Output() modalClosed = new EventEmitter<void>();

  selectedLocation = signal<{ lat: number; lng: number } | null>(null);

  onLocationSelected(coords: { lat: number; lng: number }): void {
    this.selectedLocation.set(coords);
  }

  confirmLocation(): void {
    const location = this.selectedLocation();
    if (location) {
      this.locationConfirmed.emit(location);
      this.closeModal();
    } else {
      alert('Por favor, selecciona una ubicación en el mapa');
    }
  }

  closeModal(): void {
    if (typeof this.isOpen === 'function' && this.isOpen.set) {
      this.isOpen.set(false);
    }
    this.modalClosed.emit();
    this.selectedLocation.set(null);
  }

  
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  get isModalOpen(): boolean {
    return typeof this.isOpen === 'function' ? this.isOpen() : this.isOpen;
  }

}
