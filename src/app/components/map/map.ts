import { ViewEncapsulation, Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.js';
import 'leaflet.offline/src/index.js';

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

  minZoom = 14
  maxZoom = 18

  // you can spedify any tile server here... eg. mapbox, google, openstreetmap
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

  dummyMarkerIcon = L.AwesomeMarkers.icon({
    icon: 'bed',
    markerColor: 'blue'
  });

  foodMarkers = L.layerGroup([
    L.marker(L.latLng(32.8719567, -117.2413123), { icon: this.foodMarkerIcon }).bindPopup('Lorem ipsum...').on('dblclick', this.markerClick.bind(this)),
    L.marker(L.latLng(32.883263266394934, -117.24240303039552), { icon: this.foodMarkerIcon }).bindPopup('Dolor sit amet...').on('dblclick', this.markerClick.bind(this))
  ]);

  dummyMarkers = L.layerGroup([
    L.marker(L.latLng(32.87785719403553, -117.24326133728029), { icon: this.dummyMarkerIcon }).bindPopup('Lorem ipsum...'),
    L.marker(L.latLng(32.87771302759221, -117.23776817321779), { icon: this.dummyMarkerIcon }).bindPopup('Lorem ipsum...')
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
    zoom: 14,
    minZoom: this.minZoom,
    maxZoom: this.maxZoom,
    center: L.latLng(32.8719567, -117.2413123),
    maxBounds: L.latLngBounds(
      L.latLng(32.89455723301066, -117.21360817551614),
      L.latLng(32.86766472466352, -117.26905480027202)
    )
  };

  onMapReady(map) {
    // @ts-ignore:TS2339
    L.control.savetiles(this.baseLayer, {
      position: 'topright',
      zoomlevels: [this.minZoom, this.maxZoom],
      confirm: function(layer, succescallback) {
          if (window.confirm("Save " + layer._tilesforSave.length)) {
              succescallback();
          }
      },
      confirmRemoval: function(layer, successCallback) {
          if (window.confirm("Remove all the tiles?")) {
              successCallback();
          }
      },
      saveText: '<i class="fa fa-download" aria-hidden="true" title="Save tiles"></i>',
      rmText: '<i class="fa fa-trash" aria-hidden="true"  title="Remove tiles"></i>'
    }).addTo(map);

    L.control.locate({
      position: 'topright',
      strings: {
          title: "Show me where I am, yo!"
      }
    }).addTo(map);

    // to figure out maxBounds uncomment this!
    map.on('moveend', event => {
      console.log(map.getBounds(), 'event');
    });

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

    this.addBaseLayerOfflineEvents();
  }

  addBaseLayerOfflineEvents() {
    let progress = 0;
    let total = 0;
    this.baseLayer.on('savestart', function(e) {
        progress = 0;
        total = e._tilesforSave.length;
    });

    this.baseLayer.on('savetileend', function(e) {
        progress++;
        document.getElementById('progress').innerHTML = `${total} / ${progress}`;
    });

    this.baseLayer.on('loadend', function(e) {
        alert("Saved all tiles");
        document.getElementById('progress').innerHTML = '';
    });

    this.baseLayer.on('tilesremoved', function(e) {
        alert("Removed all tiles");
    });
  }

  markerClick(event) {
    this.routeToLatLngWithNativeApp(event.latlng.lat, event.latlng.lng);
  }

  routeToLatLngWithNativeApp(lat, lng) {
    if /* if we're on iOS, open in Apple Maps */
      ((navigator.platform.indexOf('iPhone') != -1) || 
       (navigator.platform.indexOf('iPad') != -1) || 
       (navigator.platform.indexOf('iPod') != -1))
      window.open(`maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`);
    else /* else use Google */
      window.open(`https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`);
  }
}
