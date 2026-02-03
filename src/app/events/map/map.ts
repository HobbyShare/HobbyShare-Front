import { Component, OnInit } from '@angular/core';
import * as L from "leaflet";

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit {
  private map: any;
  private userMarker: L.Marker<any> | undefined;

  ngOnInit(): void {
    this.initMap();
  }

  private initMap() {
    this.map = L.map('map').setView([41.40237282641176, 2.194541858893481], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map)
  }

  getLocation() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        if (this.userMarker) {
          this.userMarker = L.marker(coords);
        } else {
          this.userMarker = L.marker(coords, {
            draggable: true
          }).addTo(this.map)
            .bindPopup("Estás aquí")
            .openPopup();

          this.userMarker.on('dragend', (event) => {
            const marker = event.target;
            const position = marker.getLatLng();
            marker.setLatLng(position).openPopup();
            this.map.setView(position, 19);
            console.log(`Marcador movido a ${position.lat}, ${position.lng}`);
          })
          }
        this.map.setView(coords, 19);
      }, () => {
        alert('No se pudo obtener la geolocalización');
      });
    } else {
      alert('Geolocalización no soportada por el navegador');
    }

  }
}
