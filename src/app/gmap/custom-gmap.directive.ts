import { Directive } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { GoogleMap, Marker } from 'angular2-google-maps/co≈re/services/google-maps-types';
import 'js-marker-clusterer/src/markerclusterer.js';
import { GmapService } from '../services/gmap.service';

declare const google;
declare const MarkerClusterer;

@Directive({
  selector: 'custom-gmap'
})
export class CustomGmapDirective {
  public googleMarkers: any;
  public _map: any;

  private markers: GMarker[];

  public constructor(private gmapsApi: GoogleMapsAPIWrapper, private gmapService: GmapService) {
    let me = this;
    this.gmapsApi.getNativeMap().then((map) => {
      // instance of the map.
      me._map = map;
      me.initializeMap();
    });
    this.markers = this.gmapService.positions;
  }

  private initializeMap() {
    let me = this;
    me.googleMarkers = me.initMarkers();
    //noinspection JSUnusedLocalSymbols
    let mc = new MarkerClusterer(
      me._map, me.googleMarkers,
      {imagePath: 'https://googlemaps.github.io/js-marker-clusterer/images/m'}
    );
  }

  private initMarkers() {
    let i = 0;
    let markers = this.markers;
    let result = [];
    for (; i < markers.length; ++i) {
      result.push(new google.maps.Marker({
          position: markers[i]
        })
      );
    }
    return result;
  }
}

interface GMarker {
  lat: number;
  lng: number;
}
