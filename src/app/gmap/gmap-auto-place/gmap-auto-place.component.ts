import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { MapsAPILoader } from 'angular2-google-maps/core';

@Component({
  selector: 'app-gmap-auto-place',
  templateUrl: './gmap-auto-place.component.html',
  styleUrls: ['./gmap-auto-place.component.css']
})
export class GmapAutoPlaceComponent implements OnInit {
  @Output('onChangePlace') public onChangePlace = new EventEmitter<any>();
  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {

          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log('=====', place);
          this.onChangePlace.emit(place);
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
        });
      });
    });
  }
}
