import { Directive, Input } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import 'js-marker-clusterer/src/markerclusterer.js';

declare const google;
declare const MarkerClusterer;

@Directive({
  selector: 'gmap-cluster'
})
export class GmapClustererDirective {
  @Input('markers') public markers: any;

  public mc: any;
  public _map: any;

  public constructor(private gmapsApi: GoogleMapsAPIWrapper) {
    this.gmapsApi.getNativeMap().then((map) => {
      this._map = map;
      this.makeCluster();
    });
  }

  private makeCluster() {
    let me = this;
    let i = 0;
    let markers = this.markers;
    let googleMarkers = [];
    for (; i < markers.length; ++i) {
      googleMarkers.push(new google.maps.Marker({
          position: markers[i]
        })
      );
    }
    me.mc = new MarkerClusterer(
      me._map, googleMarkers,
      {imagePath: 'https://googlemaps.github.io/js-marker-clusterer/images/m'}
    );
  }
}
