import { Component, ElementRef, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {  } from '@types/googlemaps';
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
  @Output('onMapsChangePlace') public onMapsChangePlace = new EventEmitter<any>();
  @Output('onHyloChangePlace') public onHyloChangePlace = new EventEmitter<any>();
  @ViewChild('keyword')
  public searchElementRef: ElementRef;
  public searchForm: FormGroup;
  public hideSearchResult: boolean = true;
  public hideNoResult: boolean = false;
  public result: any = {};
  public gmapResults: any = {};
  public searchToken: string = '';

  constructor(public fb: FormBuilder,
              private mainService: MainService,
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
    if (this.searchToken.length >= 3) {
      this.hideSearchResult = false;
      this.mainService.searchCompany(this.searchToken).subscribe(
        (resp) => {
          console.log('searchForm ==> resp: ', resp);
          this.result = resp;
          this.hideNoResult = resp.company.length !== 0;
        }
      );

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
  }

}
