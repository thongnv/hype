import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild }
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
  @ViewChild('keyword')
  public searchElementRef: ElementRef;
  public imageUrl: any;
  public hideSearchResult: boolean = true;
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

  public ngOnInit() {
    // TODO
  }

  public onSubmit(event, keyword?: string) {
    this.hideSearchResult = false;
    this.searchToken = event.type === 'submit' ?
      this.group.value.keyword.trim() : keyword.trim();
    if (this.searchToken.length >= 3) {
      this.hideSearchResult = false;
      this.mainservice.search(this.searchToken).then((resp) => {
        this.result = resp;
        if (resp.event.length + resp.article.length === 0) {
          this.hideNoResult = false;
        } else {
          this.hideNoResult = true;
        }
      });

      // get data from google map autocomplete
      this.mapsAPILoader.load().then(() => {
        let inputText = this.searchElementRef.nativeElement.value;
        let autocompleteService = new google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions(
          {input: inputText},
          (result, status) => this.gmapResults = result);
      });

    } else {
      this.result = {};
      this.hideNoResult = false;
    }
  }

  public onCloseSuggestion(data) {
    this.hideSearchResult = true;
    this.searchElementRef.nativeElement.value = data.Title;
    this.onHyloChangePlace.emit(data);
  }

  public onOpenSuggestion() {
    this.hideSearchResult = false;
  }

  // events
  public onGmapItemClick(data) {
    this.searchElementRef.nativeElement.value = data.structured_formatting.main_text;
    this.onMapsChangePlace.emit(data);
    this.hideSearchResult = true;
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
