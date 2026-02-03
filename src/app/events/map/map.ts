import { Component, OnInit, effect, inject } from '@angular/core';
import * as L from 'leaflet';
import { EventsService } from '../../core/services/events.service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit {
  private eventsService = inject(EventsService);

  private map: any;
  private userMarker: L.Marker<any> | undefined;

  private eventMarkers: L.Marker<any>[] = [];

  events = this.eventsService.events;

  constructor() {
    // Effect: se ejecuta automáticamente cuando cambia events()
    effect(() => {
      const currentEvents = this.events();

      if (this.map && currentEvents.length > 0) {
        console.log('Pintando marcadores de eventos:', currentEvents.length);
        this.paintEventMarkers(currentEvents);
      }
    });
  }

  ngOnInit(): void {
    this.initMap();

    this.eventsService.loadEvents();
  }

  // INICIALIZACIÓN DEL MAPA
  private initMap(): void {
    this.map = L.map('map').setView([41.40237282641176, 2.194541858893481], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    console.log('Mapa inicializado');
  }

  //MARCADORES DE EVENTOS
  // Icono personalizado para los eventos: marcador naranja
  private createEventIcon(): L.Icon {
    return L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  private paintEventMarkers(events: any[]): void {
    this.eventMarkers.forEach(marker => marker.remove());
    this.eventMarkers = [];

    let paintedCount = 0;

    events.forEach(event => {
      if (!event.lat || !event.lng || (event.lat === 0 && event.lng === 0)) {
        console.warn('Evento sin coordenadas válidas:', event.title);
        return;
      }

      try {
        const marker = L.marker([event.lat, event.lng], {
          icon: this.createEventIcon(),
        })
          .addTo(this.map)
          .bindPopup(this.createPopupContent(event));

        this.eventMarkers.push(marker);
        paintedCount++;
      } catch (error) {
        console.error('❌ Error pintando marcador:', error, event);
      }
    });

    console.log(`Marcadores pintados: ${paintedCount} de ${events.length}`);
  }

  private createPopupContent(event: any): string {
    // hobby puede ser un array o un string según cómo lo devuelva la API
    const hobbyText = Array.isArray(event.hobby) ? event.hobby.join(', ') : event.hobby;

    return `
      <div style="min-width: 200px;">
        <h4 style="margin: 0 0 8px 0; font-size: 16px; color: #333;">${event.title}</h4>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Hobby:</strong> ${hobbyText}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Fecha:</strong> ${event.date}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Creador:</strong> ${event.creatorUser}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Participantes:</strong> ${event.participants?.length || 0}</p>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #666; font-style: italic;">${event.description}</p>
      </div>
    `;
  }

  // MARCADOR DE GEOLOCALIZACIÓN DEL USUARIO
  // Icono personalizado para la posición del usuario: marcador azul
  private createUserIcon(): L.Icon {
    return L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];

          if (this.userMarker) {
            this.userMarker.setLatLng(coords).openPopup();
          } else {
            this.userMarker = L.marker(coords, {
              icon: this.createUserIcon(),
              draggable: true,
            })
              .addTo(this.map)
              .bindPopup('Estás aquí')
              .openPopup();

            this.userMarker.on('dragend', (event) => {
              const marker = event.target;
              const position = marker.getLatLng();
              marker.setLatLng(position).openPopup();
              this.map.setView(position, 19);
              console.log(`Marcador movido a ${position.lat}, ${position.lng}`);
            });
          }

          this.map.setView(coords, 15);
          console.log('Geolocalización obtenida:', coords);
        },
        () => {
          alert('No se pudo obtener la geolocalización');
        }
      );
    } else {
      alert('Geolocalización no soportada por el navegador');
    }
  }
}
