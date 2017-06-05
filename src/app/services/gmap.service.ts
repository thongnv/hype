import { Injectable } from '@angular/core';
import 'js-marker-clusterer/src/markerclusterer.js';

declare const google;

@Injectable()
export class GmapService {
  public markers: any;

  public getMarkers(): GMarker[] {
    return [
      {lat: 21.033933, lng: 105.786635},
      {lat: 21.033492, lng: 105.793051},
      {lat: 21.038319, lng: 105.821257},
      {lat: 1.282270, lng: 103.871979},
      {lat: 1.293269, lng: 103.881959},
      {lat: 1.402270, lng: 103.791979},
      {lat: 1.413269, lng: 103.781959},
      {lat: 1.382270, lng: 103.771979},
      {lat: 1.393269, lng: 103.781959},
    ];
  }

  public updateMarkers() {
    this.markers = [
      {lat: 1.293269, lng: 103.881959},
      {lat: 1.402270, lng: 103.791979},
      {lat: 1.413269, lng: 103.781959},
      {lat: 1.382270, lng: 103.771979},
      {lat: 1.393269, lng: 103.781959},
    ];
    return this.markers;
  }

}

interface GMarker {
  lat: number;
  lng: number;
}
