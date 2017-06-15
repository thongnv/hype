import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { DomSanitizer } from '@angular/platform-browser';
import { } from '@types/googlemaps';
import { FormGroup } from '@angular/forms';
import { FileReaderEvent } from '../../app.interface';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-gmap-auto-place',
  templateUrl: './gmap-auto-place.component.html',
  styleUrls: ['./gmap-auto-place.component.css']
})
export class GmapAutoPlaceComponent implements OnInit {
  @Input('group') public group: FormGroup;
  @Input('description') public description: boolean;
  @Input('image') public image: boolean;
  @Output('onChangePlace') public onChangePlace = new EventEmitter<any>();
  @ViewChild('search')
  public searchElementRef: ElementRef;
  public imageUrl: any;

  public constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public sanitizer: DomSanitizer) {
  }

  public ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        // types: ['address'],
        componentRestrictions: {country: 'sg'}
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.onChangePlace.emit(place);
          console.log('==>', place);
          this.group.controls.place.patchValue(place.formatted_address);
          this.group.controls.lat.patchValue(place.geometry.location.lat());
          this.group.controls.lng.patchValue(place.geometry.location.lng());
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
        });
      });
    });
  }

  public readUrl(event) {
    console.log('image:', event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e: FileReaderEvent) => {
        this.imageUrl = {
          url: URL.createObjectURL(event.target.files[0]),
          value: e.target.result.replace(/^data:image\/\S+;base64,/, ''),
          filename: event.target.files[0].name,
          filemime: event.target.files[0].type
        };
        this.group.get('image').patchValue(this.imageUrl);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
