import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

// 3rds
import { Ng2ImgToolsService } from 'ng2-img-tools';

import * as moment from 'moment/moment';
import { AppState } from '../../app.service';
import { EventService } from '../../services/event.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-share-event',
  templateUrl: './share-event.component.html',
  styleUrls: ['./share-event.component.css']
})

export class ShareEventComponent implements OnInit {
  public eventForm: FormGroup = this.fb.group({
    eventName: ['', Validators.required],
    eventDetail: ['', Validators.required],
    eventCategory: ['', Validators.required],
    eventPlace: this.fb.group({
      place: ['', Validators.required],
      lat: [''],
      lng: [''],
    }),
    eventDate: [''],
    eventPrice: [''],
    call2action: this.fb.group({
      eventType: ['1'],
      eventLink: [''],
    }),
    eventImages: ['', Validators.required],
    eventMentions: this.fb.array(['']),
  });
  public user: any;
  public previewData: any;
  public categories: any[];
  public previewUrl: any[] = [];
  public showMore: boolean = false;
  public showPreview: boolean = false;
  public slides: any[] = [];
  public addImage: boolean = true;
  public types = [
    { value: '1', display: 'Buy Tix' },
    { value: '2', display: 'More Info' }
  ];
  constructor(public fb: FormBuilder, private eventService: EventService,
              public appState: AppState,
              public sanitizer: DomSanitizer,
              private loaderService: LoaderService,
              private ng2ImgToolsService: Ng2ImgToolsService,
              public mainService: MainService,
              private router: Router) {

    this.loaderService.show();
    this.eventService.getCategoryEvent().subscribe(
      (response: any) => {
        this.categories = response.data;
        this.loaderService.hide();
      }
    );
    this.mainService.getUserProfile().then((response) => {
      this.user = response;
    });
  }

  public ngOnInit() {
    // TODO
  }

  public minMax(control: FormControl) {
    console.log(control.value);
    return parseInt(control.value, 10) >= 0 && parseInt(control.value, 10) <= 300 ? null : {
      minMax: true
    };
  }

  public onEventPriceChange(evt) {
    console.log('evt: ', evt.target.value);
    if (evt.target.valueAsNumber > 300 || evt.target.valueAsNumber < 0) {
      document.getElementById('eventPriceErr').innerText = 'Price is number and between 0-300 $';
    } else if (evt.target.value.length == 0 || evt.target.valueAsNumber <= 300 || evt.target.valueAsNumber > 0) {
      this.eventForm.patchValue({'eventPrice': 0});
      document.getElementById('eventPriceErr').innerText = '';
    }
  }

  public onRemovePreview(imageUrl) {
    let imageId = this.previewUrl.indexOf(imageUrl);
    delete this.previewUrl[imageId];
    this.previewUrl = this.previewUrl.filter((img) => img !== imageUrl);
    if (this.previewUrl.length < 4) {
      this.addImage = true;
    }
  }

  public readUrl(event) {
    let reader = [];
    if (event.target.files && event.target.files[0] && this.previewUrl.length < 4) {
      for (let i = 0; i < event.target.files.length && i < 4; i++) {
        reader[i] = new FileReader();
        reader[i].onload = (e) => {
          let imageFile = event.target.files[i];

          // resize image
          this.ng2ImgToolsService.resizeExactFill([imageFile], 480, 330)
            .subscribe((resizedImage) => {
              let img = {
                url: URL.createObjectURL(resizedImage),
                value: e.target.result.replace(/^data:image\/\S+;base64,/, ''),
                filename: event.target.files[i].name,
                filemime: event.target.files[i].type
              };

              this.previewUrl.push(img);

              if (this.previewUrl.length >= 4) {
                this.addImage = false;
              }
            });
        };
        reader[i].readAsDataURL(event.target.files[i]);
      }
    }
  }

  public addMention() {
    const mentions = this.eventForm.get('eventMentions') as FormArray;
    mentions.push(new FormControl());
  }

  public setTime(event) {
    console.log(moment(event).unix());
  }

  public switchView() {
    this.showPreview = !this.showPreview;
  }

  public onSubmit(): void {
    let event = this.eventForm.value;
    event.eventImages = this.previewUrl;
    event.created = moment(event.eventDate).unix();
    let data = this.mapEvent(event);
    this.loaderService.show();
    this.eventService.postEvent(data).subscribe((response: any) => {
      if (response.status) {
        this.loaderService.hide();
        this.router.navigate([response.data.slug]);
      }
    });
  }

  public onPreview() {
    let event = this.eventForm.value;
    event.eventImages = this.previewUrl;
    event.Date = moment(event.Date).unix();
    this.previewData = event;
    this.initPreview();
  }

  public initPreview() {
    this.showPreview = true;
    this.slides = [];
    for (let img of this.previewUrl) {
      if (img) {
        this.slides.push({image: img.url, active: false});
      }
    }
  }

  public mapEvent(event) {
    return {
      title: event.eventName,
      body: event.eventDetail,
      created: event.created,
      field_images: event.eventImages,
      field_event_category: event.eventCategory,
      field_location_place: [{
        field_latitude: event.eventPlace.lat,
        field_longitude: event.eventPlace.lng,
        field_location_address: event.eventPlace.place
      }],
      field_event_option: [{
        field_call_to_action_group: event.call2action.eventType,
        field_call_to_action_link: event.call2action.eventLink,
        field_price: event.eventPrice,
        field_mentioned_by: event.eventMentions
      }]
    };
  }
}
