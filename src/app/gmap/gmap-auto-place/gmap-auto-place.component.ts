import {
  Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild
}
  from '@angular/core';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { DomSanitizer } from '@angular/platform-browser';
import {  } from '@types/googlemaps';
import { FormGroup } from '@angular/forms';
import { FileReaderEvent, Image } from '../../app.interface';
import { MainService } from '../../services/main.service';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-gmap-auto-place',
  templateUrl: './gmap-auto-place.component.html',
  styleUrls: ['./gmap-auto-place.component.css']
})
export class GmapAutoPlaceComponent implements OnInit {
  @Input() public group: FormGroup;
  @Input() public description: boolean;
  @Input() public hasImage: boolean;
  @Input() public image: Image;

  @Output() public onMapsChangePlace = new EventEmitter<any>();
  @Output() public onHyloChangePlace = new EventEmitter<any>();

  @ViewChild('keyword') public searchElementRef: ElementRef;
  @ViewChild('addressInput') public addressElementRef: ElementRef;

  public hideSearchResult: boolean = true;
  public hideAddressResult: boolean = true;
  public hideNoResult: boolean = false;
  public result = {};
  public gmapResults = [];
  public searchToken = '';
  public hideAddressInput = true;
  public hideCustomAddress = true;

  public constructor(
    private mapsAPILoader: MapsAPILoader,
    private mainService: MainService,
    public sanitizer: DomSanitizer) {
  }

  public ngOnInit() {
    if (this.hasImage && this.image) {
      this.group.get('image').patchValue(this.image);
    }
  }

  public showAddressInput() {
    this.hideAddressInput = false;
  }

  public markTouchMCE() {
    this.group.controls.description.markAsTouched();
  }

  public onSubmit(event, keyword?: string) {
    this.searchToken = event.type === 'submit' ?
      this.group.value.keyword.trim() : keyword.trim();
    if (this.searchToken.length >= 3) {
      this.hideSearchResult = false;
      this.mainService.search(this.searchToken).subscribe((resp) => {
        this.result = resp;
        this.hideNoResult = resp.event.length + resp.article.length !== 0;
      });

      this.mapsAPILoader.load().then(() => {
        let inputText = this.searchElementRef.nativeElement.value;
        let autoCompleteService = new google.maps.places.AutocompleteService();
        autoCompleteService.getPlacePredictions({
            componentRestrictions: {
              country: 'sg'
            },
            input: inputText
          },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              this.gmapResults = result;
            } else {
              this.gmapResults = [];
            }
            this.hideCustomAddress = false;
          });
      });

    }
    if (this.searchToken.length === 0) {
      this.result = {};
      this.hideSearchResult = true;
    }
  }

  public onSearchAddress(keyword: string) {
    this.searchToken = keyword.trim();
    if (this.searchToken.length >= 3) {
      this.hideAddressResult = false;
      this.mapsAPILoader.load().then(() => {
        let autoCompleteService = new google.maps.places.AutocompleteService();
        autoCompleteService.getPlacePredictions({
            componentRestrictions: {
              country: 'sg'
            },
            input: this.searchToken
          },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              this.gmapResults = result;
            } else {
              this.gmapResults = [];
            }
          });
      });

    }
    if (this.searchToken.length === 0) {
      this.result = {};
      this.hideSearchResult = true;
    }
  }

  public onCloseSuggestion(data) {
    this.hideSearchResult = true;
    this.hideCustomAddress = true;
    if (data.Title) {
      this.searchElementRef.nativeElement.value = data.Title;
    }
    this.onHyloChangePlace.emit(data);
  }

  public onGmapItemClick(data) {
    this.searchElementRef.nativeElement.value = data.description;
    this.onMapsChangePlace.emit(data);
    this.hideSearchResult = true;
    this.hideCustomAddress = true;
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
        this.image = {
          fid: null,
          url: URL.createObjectURL(event.target.files[0]),
          value: e.target.result.replace(/^data:image\/\S+;base64,/, ''),
          filename: event.target.files[0].name,
          filemime: event.target.files[0].type,
          filesize: event.target.files[0].size
        };
        this.group.get('image').patchValue(this.image);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
