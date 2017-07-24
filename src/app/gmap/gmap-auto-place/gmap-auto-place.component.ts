import {
  Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, ViewChild
}
  from '@angular/core';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { DomSanitizer } from '@angular/platform-browser';
import {  } from '@types/googlemaps';
import { FormGroup } from '@angular/forms';
import { FileReaderEvent } from '../../app.interface';
import { MainService } from '../../services/main.service';

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
  @Output('onMapsChangePlace') public onMapsChangePlace = new EventEmitter<any>();
  @Output('onHyloChangePlace') public onHyloChangePlace = new EventEmitter<any>();
  @ViewChild('keyword') public searchElementRef: ElementRef;
  @ViewChild('addressInput') public addressElementRef: ElementRef;
  public imageUrl: any;
  public hideSearchResult: boolean = true;
  public hideAddressResult: boolean = true;
  public hideNoResult: boolean = false;
  public result: any = {};
  public gmapResults: any = {};
  public searchToken: string = '';

  public constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private mainservice: MainService,
    public sanitizer: DomSanitizer) {
  }

  @HostListener('document:click', ['$event'])

  public onClick(event) {
    if (!this.searchElementRef.nativeElement.contains(event.target)) {
      this.hideSearchResult = true;
    }
  }
  public ngOnInit() {
    // TODO
  }

  public markTouchMCE() {
    this.group.controls.description.markAsTouched();
  }

  public onSubmit(event, keyword?: string) {
    this.searchToken = event.type === 'submit' ?
      this.group.value.keyword.trim() : keyword.trim();
    if (this.searchToken.length >= 3) {
      this.hideSearchResult = false;
      this.mainservice.search(this.searchToken).subscribe((resp) => {
        this.result = resp;
        this.hideNoResult = resp.event.length + resp.article.length !== 0;
      });

      // get data from google map autocomplete
      this.mapsAPILoader.load().then(() => {
        let inputText = this.searchElementRef.nativeElement.value;
        let autocompleteService = new google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions({
            componentRestrictions: {
              country: 'sg'
            },
            input: inputText
          },
          (result, status) => this.gmapResults = result);
      });

    }
    if (this.searchToken.length === 0) {
      this.result = {};
      this.hideSearchResult = true;
    }
  }

  public onSearchAddress(keyword: string) {
    if (keyword.length >= 3) {
      this.hideAddressResult = false;
      this.mapsAPILoader.load().then(() => {
        let autocompleteService = new google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions({
            componentRestrictions: {
              country: 'sg'
            },
            input: keyword.trim()
          },
          (result, status) => this.gmapResults = result);
      });

    }
    if (this.searchToken.length === 0) {
      this.result = {};
      this.hideSearchResult = true;
    }
  }

  public onCloseSuggestion(data) {
    this.hideSearchResult = true;
    if (data.Title) {
      this.searchElementRef.nativeElement.value = data.Title;
    }
    this.onHyloChangePlace.emit(data);
  }

  public onGmapItemClick(data) {
    this.searchElementRef.nativeElement.value = data.description;
    this.onMapsChangePlace.emit(data);
    this.hideSearchResult = true;
  }

  public onAddressItemClick(data) {
    this.addressElementRef.nativeElement.value = data.description;
    this.onMapsChangePlace.emit(data);
    this.hideAddressResult = true;
  }

  public readUrl(event) {
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
