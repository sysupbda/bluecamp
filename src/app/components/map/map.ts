import { ViewEncapsulation, Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import 'leaflet.offline/src/index.js';

// to specify the leaflet.awesomeMarkers icon CSS provider
L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

@Component({
  selector: 'app-ucsd-map',
  templateUrl: './map.html',
  styleUrls: ['./map.scss'],
  encapsulation: ViewEncapsulation.None
})

// icons: https://fontawesome.com/icons?d=gallery
export class MapComponent {

  minZoom = 16;
  maxZoom = 18;

  // @ts-ignore:TS2339
  baseLayer = L.tileLayer.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap',
      subdomains: 'abc',
      maxZoom: 18
  });

  foodMarkerIcon = L.AwesomeMarkers.icon({
    icon: 'utensils',
    markerColor: 'red'
  });

  primaryMarkerIcon = L.AwesomeMarkers.icon({
    icon: 'bed',
    markerColor: 'blue'
  });

  foodMarkers = L.layerGroup([
    L.marker(L.latLng(32.874762, -117.242364),
      { icon: this.foodMarkerIcon }).bindPopup('Dorm cafeteria').on('dblclick', this.markerClick.bind(this)),
    L.marker(L.latLng(32.879718, -117.236940),
      { icon: this.foodMarkerIcon }).bindPopup('Price Center Plaza').on('dblclick', this.markerClick.bind(this))
  ]);

  primaryMarkers = L.layerGroup([
    L.marker(L.latLng(32.874512, -117.241651), { icon: this.primaryMarkerIcon }).bindPopup('Residence'),
    L.marker(L.latLng(32.879924, -117.237150), { icon: this.primaryMarkerIcon }).bindPopup('Conference')
  ]);

  // layer groups to show on the top right corner
  layersControl = {
    overlays: {
      'Food': this.foodMarkers,
      'Primary': this.primaryMarkers
    }
  };

  options = {
    layers: [ // to enable a layer on init add it to this array
      this.baseLayer,
      this.foodMarkers
    ],
    zoom: 16,
    minZoom: this.minZoom,
    maxZoom: this.maxZoom,
    center: L.latLng(32.877473, -117.239686),
    maxBounds: L.latLngBounds(
      L.latLng(32.8820375, -117.2364797),
      L.latLng(32.8737385, -117.2460197)
    )
  };

  onMapReady(map) {
    // @ts-ignore:TS2339
    L.control.savetiles(this.baseLayer, {
      position: 'topright',
      zoomlevels: [this.minZoom, this.maxZoom],
    }).addTo(map);

    // @ts-ignore:TS2339
    L.control._saveTiles();
    L.control.locate({
      position: 'topright',
      strings: {
          title: 'Looking for your location'
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

    this.addBaseLayerOfflineEvents();
  }

  addBaseLayerOfflineEvents() {
    let progress = 0;
    let total = 0;
    this.baseLayer.on('savestart', function(e) {
        progress = 0;
        total = e._tilesforSave.length;
    });

    this.baseLayer.on('savetileend', function() {
        progress++;
        document.getElementById('progress').innerHTML = `${total} / ${progress}`;
    });
  }

  markerClick(event) {
    this.routeToLatLngWithNativeApp(event.latlng.lat, event.latlng.lng);
  }

  routeToLatLngWithNativeApp(lat, lng) {
    if /* if we're on iOS, open in Apple Maps */
      ((navigator.platform.indexOf('iPhone') !== -1) ||
       (navigator.platform.indexOf('iPad') !== -1) ||
       (navigator.platform.indexOf('iPod') !== -1)) {
      window.open(`maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`);
    } else /* else use Google */ {
      window.open(`https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`);
    }
  }
}
