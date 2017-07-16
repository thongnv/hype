import { Component, ElementRef, OnInit, Input, Output, ViewChild, EventEmitter, HostListener } from '@angular/core';
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
  @Input() public group: FormGroup;
  @Input() public description: boolean;
  @Input() public image: boolean;
  @Input() public text: string;
  @Output() public onMapsChangePlace = new EventEmitter<any>();
  @Output() public onHyloChangePlace = new EventEmitter<any>();
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

  @HostListener('document:click', ['$event'])

  public onClick(event) {
    if (!this.searchElementRef.nativeElement.contains(event.target)) {
      this.hideSearchResult = true;
    }
  }

  public ngOnInit() {
    this.searchForm = this.fb.group({
      keyword: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });
  }

  public onSubmit(event, keyword?: string) {
    this.searchToken = event.type === 'submit' ?
      this.searchForm.value.keyword.trim() : keyword.trim();
    if (this.searchToken.length >= 3) {
      this.hideSearchResult = false;
      this.mainService.searchCompany(this.searchToken).subscribe(
        (resp) => {
          this.result = resp;
          this.hideNoResult = resp.company.length !== 0;
        }
      );

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

  public onCloseSuggestion(data) {
    this.hideSearchResult = true;
    this.searchElementRef.nativeElement.value = data.Title;
    this.onHyloChangePlace.emit(data);
  }

  public onGmapItemClick(data) {
    this.searchElementRef.nativeElement.value = data.description;
    this.onMapsChangePlace.emit(data);
  }

}
