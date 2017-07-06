import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

import * as moment from 'moment/moment';
import { EventService } from '../../services/event.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { MainService } from '../../services/main.service';
import { AppSetting } from '../../app.setting';

import { HyperSearchComponent } from '../../hyper-search/hyper-search.component';
import { UserService } from '../../services/user.service';

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
    eventImages: [''],
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
    {value: '1', display: 'Buy Tix'},
    {value: '2', display: 'More Info'}
  ];
  public gMapStyles: any;
  public validCaptcha = false;

  public submitted: boolean = false;

  @ViewChild(HyperSearchComponent)
  private hyperSearchComponent: HyperSearchComponent;

  constructor(public fb: FormBuilder, private eventService: EventService,
              public sanitizer: DomSanitizer,
              private loaderService: LoaderService,
              public userService: UserService,
              private router: Router) {

    this.loaderService.show();
    this.userService.checkLogin().subscribe(
      (response: any) => {
        if (response === 0) {
          this.router.navigate(['/login'], {skipLocationChange: true}).then();
        }
      }
    );
    this.eventService.getCategoryEvent().subscribe(
      (response: any) => {
        this.categories = response.data;
        this.loaderService.hide();
      }
    );
    this.userService.getUserProfile().subscribe((response) => {
      this.user = response.user;
    });
  }

  public ngOnInit() {
    this.gMapStyles = AppSetting.GMAP_STYLE;
    // TODO
  }

  public minMax(control: FormControl) {
    return parseInt(control.value, 10) >= 0 && parseInt(control.value, 10) <= 300 ? null : {
      minMax: true
    };
  }

  public onEventPriceChange(evt) {
    if (evt.target.valueAsNumber > 300 || evt.target.valueAsNumber < 0) {
      document.getElementById('eventPriceErr').innerText = 'Price is number and between 0-300 $';
    } else if (evt.target.value.length === 0) {
      this.eventForm.patchValue({eventPrice: 0});
      document.getElementById('eventPriceErr').innerText = '';
    }
    if (evt.target.valueAsNumber <= 300 && evt.target.valueAsNumber > 0) {
      document.getElementById('eventPriceErr').innerText = '';
    }
  }

  public onMapsChangePlace(data) {
    // get lat long from place id
    let geocoder = new google.maps.Geocoder;
    geocoder.geocode({placeId: data.place_id}, (results, status) => {
      if (status.toString() === 'OK') {
        // set lat long for eventPlace
        this.eventForm.controls.eventPlace.patchValue({
          place: data.structured_formatting.main_text,
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
      }

      // hide result
      this.hyperSearchComponent.hideSearchResult = true;
    });
  }

  public onHyloChangePlace(data) {
    this.eventForm.controls.eventPlace.patchValue({
      place: data.Title,
      lat: Number(data.Lat),
      lng: Number(data.Long),
    });
    this.hyperSearchComponent.hideSearchResult = true;
  }

  public onRemovePreview(imageUrl) {
    let imageId = this.previewUrl.indexOf(imageUrl);
    delete this.previewUrl[imageId];
    this.previewUrl = this.previewUrl.filter((img) => img !== imageUrl);
    if (this.previewUrl.length < 4) {
      this.addImage = true;
    }
  }

  public checkCaptcha(captcha) {
    if (captcha) {
      this.validCaptcha = true;
    }
  }

  public readUrl(event) {
    let reader = [];
    if (event.target.files && event.target.files[0] && this.previewUrl.length < 4) {
      let typeFile = new RegExp(`^img\/\w+`);
      for (let i = 0; i < event.target.files.length && i < 4; i++) {
        if (true) {
          reader[i] = new FileReader();
          reader[i].onload = (e) => {
            let image = new Image();
            image.src = e.target.result;

            this.resizeImage(image, 480, 330, (resizedImage) => {
              let img = {
                url: resizedImage,
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
  }

  public addMention() {
    const mentions = this.eventForm.get('eventMentions') as FormArray;
    mentions.push(new FormControl());
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
    if (!this.submitted) {
      this.submitted = true;
      this.eventService.postEvent(data).subscribe((response: any) => {
        if (response.status) {
          this.loaderService.hide();
          this.submitted = false;
          this.router.navigate([response.data.slug]);
        }
      });
    }
  }

  public onPreview() {
    let event = this.eventForm.value;
    event.eventImages = this.previewUrl;
    event.Date = moment(event.eventDate).unix();
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

  // helper functions
  private resizeImage(img, maxWidth, maxHeight, callback) {
    return img.onload = () => {
      // get image dimension
      let width = img.width;
      let height = img.height;

      // set width and height to the max values
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      // create canvas object
      let canvas = document.createElement('canvas');

      // set canvas to the new calculated dimension values
      canvas.width = maxWidth;
      canvas.height = maxHeight;

      // create canvas context 2d and align image to center
      let startX = maxWidth / 2 - width / 2;
      let startY = maxHeight / 2 - height / 2;
      let ctx = canvas.getContext('2d', {alpha: false});

      // draw image to canvas
      ctx.drawImage(img, startX, startY, width, height);

      // convert canvas to image
      let dataUrl = canvas.toDataURL('image/jpeg');

      // run callback with result
      callback(dataUrl);

    };
  }
}
