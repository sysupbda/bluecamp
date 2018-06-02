import { Component } from '@angular/core';
import { tileLayer, latLng } from 'leaflet';

@Component({
  selector: 'map',
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})

export class MapComponent {

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909)
  };
}
