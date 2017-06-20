import { Component, ElementRef, OnInit, NgZone, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { } from '@types/googlemaps';
import { MapsAPILoader } from 'angular2-google-maps/core';

import { MainService } from '../services/main.service';

@Component({
  selector: 'app-hyper-search',
  templateUrl: './hyper-search.component.html',
  styleUrls: ['./hyper-search.component.css']
})
export class HyperSearchComponent implements OnInit {
  @Input('group') public group: FormGroup;
  @Input('description') public description: boolean;
  @Input('image') public image: boolean;
  @Output('onChangePlace') public onChangePlace = new EventEmitter<any>();
  @ViewChild('keyword')
  public searchElementRef: ElementRef;
  public searchForm: FormGroup;
  public hideSearchResult: boolean = true;
  public hideNoResult: boolean = false;
  public result: any = {};
  public gmapResults: any = {};
  public searchToken: string = '';

  constructor(public fb: FormBuilder,
              private mainservice: MainService,
              private ngZone: NgZone,
              private mapsAPILoader: MapsAPILoader) {
  }

  public ngOnInit() {
    this.searchForm = this.fb.group({
      keyword: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });
  }

  public onSubmit(event, keyword?: string) {
    this.hideSearchResult = false;
    this.searchToken = event.type === 'submit' ?
      this.searchForm.value.keyword.trim() : keyword.trim();

    console.log('searchToken: ', this.searchToken);
    if (this.searchToken.length >= 3) {
      this.hideSearchResult = false;
      this.mainservice.search(this.searchToken).then((resp) => {
        console.log('searchForm ==> resp: ', resp);
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
        autocompleteService.getPlacePredictions({input: inputText}, (result, status) =>this.gmapResults = result);
      });


    } else {
      this.result = {};
      this.hideNoResult = false;
    }
  }

  public onCloseSuggestion() {
    this.hideSearchResult = true;
  }

  public onOpenSuggestion() {
    this.hideSearchResult = false;
  }

  // events
  public onGmapItemClick(data) {
    this.searchElementRef.nativeElement.value = data.structured_formatting.main_text;
    this.onChangePlace.emit(data);
  }

}