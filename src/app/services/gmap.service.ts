import { Injectable } from '@angular/core';
import 'js-marker-clusterer/src/markerclusterer.js';

declare const google;

@Injectable()
export class GmapService {
  public markers: any;

  public getMarkers(): GMarker[] {
    return [
      {lat: 1.290270, lng: 103.851959},
      {lat: 1.280270, lng: 103.851959},
      {lat: 1.271271, lng: 103.861969},
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
