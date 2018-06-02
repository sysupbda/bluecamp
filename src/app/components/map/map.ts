import { ViewEncapsulation, Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import { log } from 'async';

// to specify the leaflet.awesomeMarkers icon CSS provider
L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

@Component({
  selector: 'map',
  templateUrl: './map.html',
  styleUrls: ['./map.scss'],
  encapsulation: ViewEncapsulation.None
})

// icons: https://fontawesome.com/icons?d=gallery
export class MapComponent {

  // you can spedify any tile server here... eg. mapbox, google, openstreetmap
  baseLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: ''
  });

  foodMarkerIcon = L.AwesomeMarkers.icon({
    icon: 'utensils',
    markerColor: 'red'
  });

  dummyMarkerIcon = L.AwesomeMarkers.icon({
    icon: 'bed',
    markerColor: 'blue'
  });

  foodMarkers = L.layerGroup([
    L.marker(L.latLng(32.772533, -117.188164), { icon: this.foodMarkerIcon }).bindPopup('Lorem ipsum...').on('dblclick', this.markerClick.bind(this)),
    L.marker(L.latLng(32.771896, -117.194621), { icon: this.foodMarkerIcon }).bindPopup('Dolor sit amet...').on('dblclick', this.markerClick.bind(this))
  ]);

  dummyMarkers = L.layerGroup([
    L.marker(L.latLng(32.771433, -117.188364), { icon: this.dummyMarkerIcon }).bindPopup('Lorem ipsum...'),
    L.marker(L.latLng(32.771523, -117.188964), { icon: this.dummyMarkerIcon }).bindPopup('Lorem ipsum...')
  ]);

  // layer groups to show on the top right corner
  layersControl = {
    overlays: {
      'Food': this.foodMarkers,
      'Dummy': this.dummyMarkers
    }
  };

  options = {
    layers: [ // to enable a layer on init add it to this array
      this.baseLayer,
      this.foodMarkers
    ],
    zoom: 16,
    maxZoom: 18,
    minZoom: 14,
    center: L.latLng(32.772533, -117.188164),
    maxBounds: L.latLngBounds(
      L.latLng(32.77998639816066, -117.17779397964479),
      L.latLng(32.76508356381435, -117.19852209091188)
    )
  };

  onMapReady(map) {
    L.control.locate({
      position: 'topright',
      strings: {
          title: "Show me where I am, yo!"
      }
    }).addTo(map);

    map.on('locationfound', event => {
      console.log(event, 'LOCATION FOUND EVENT');
      const icon = L.divIcon({ className: 'map-location' });
      const latLng = event.latlng;
      const radius = event.accuracy / 2;

      L.marker([ latLng.lat, latLng.lng ], { icon })
        .addTo(map)
        .bindPopup(`You are within ${radius} meters from this point`);

      L.circle(event.latlng, radius).addTo(map);
    });

    map.on('click', event => {
      const latLng = event.latlng;
      console.log(latLng, 'latLng');
      L.marker([ latLng.lat, latLng.lng ]).addTo(map);
    });
  }

  markerClick(event) {
    this.routeToLatLngWithNativeApp(event.latlng.lat, event.latlng.lng);
  }

  routeToLatLngWithNativeApp(lat, lng) {
    if /* if we're on iOS, open in Apple Maps */
      ((navigator.platform.indexOf("iPhone") != -1) || 
       (navigator.platform.indexOf("iPad") != -1) || 
       (navigator.platform.indexOf("iPod") != -1))
      window.open(`maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`);
    else /* else use Google */
      window.open(`https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`);
  }
}
