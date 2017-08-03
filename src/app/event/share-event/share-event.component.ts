import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

import * as moment from 'moment/moment';
import { EventService } from '../../services/event.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { AppSetting } from '../../app.setting';

import { HyperSearchComponent } from '../../hyper-search/hyper-search.component';
import { UserService } from '../../services/user.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { WindowUtilService } from '../../services/window-ultil.service';
import { Image } from '../../app.interface';

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
    eventTags: ['', Validators.required],
    eventPlace: this.fb.group({
      place: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
    }),
    eventStartDate: [''],
    eventEndDate: [''],
    eventPrices: this.fb.array(['']),
    eventOrganized: [''],
    call2action: this.fb.group({
      eventType: ['1'],
      eventLink: [''],
    }),
    eventMentions: this.fb.array(['']),
  });
  public user: any;
  public previewData: any;
  public categories: any[];
  public tags: any[];
  public previewUrls: any[] = [];
  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public showMore: boolean = false;
  public showPreview: boolean = false;
  public slides: any[] = [];
  public addImage: boolean = true;
  public startDate = new Date();
  public endDate = new Date();
  public today = new Date();
  public types = [
    {value: '1', display: 'Buy Tix'},
    {value: '2', display: 'More Info'}
  ];
  public gMapStyles: any;
  public validCaptcha = false;
  public validSize = true;
  public validType = true;
  public submitted = false;
  public layoutWidth: number;
  public innerWidth: number;
  public prices = [];
  public eventTags = [];
  public checkTags = [];

  @ViewChild(HyperSearchComponent)
  private hyperSearchComponent: HyperSearchComponent;

  constructor(private titleService: Title,
              public fb: FormBuilder,
              private eventService: EventService,
              public sanitizer: DomSanitizer,
              private localStorageService: LocalStorageService,
              private loaderService: LoaderService,
              public userService: UserService,
              private router: Router,
              private windowRef: WindowUtilService) {
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    console.log(this.windowRef.rootContainer);
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 185);
  }

  public ngOnInit() {
    this.titleService.setTitle('Share An Event');
    this.loaderService.show();
    this.user = this.localStorageService.get('user');
    document.getElementById('event-name').focus();
    if (!this.user) {
      this.router.navigate(['/login'], {skipLocationChange: true}).then();
    }
    this.eventService.getCategoryEvent().subscribe(
      (response: any) => {
        this.categories = response.data;
        this.loaderService.hide();
      }
    );
    this.eventService.getTagsEvent().subscribe(
      (response: any) => {
        this.tags = response.data;
        this.loaderService.hide();
      }
    );
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 185);
  }

  public onStartDateChange() {
    if (this.startDate > this.endDate) {
      this.endDate = this.startDate;
    }
  }

  public onEventPriceChange(evt) {
    if (evt.target.valueAsNumber > 2000 || evt.target.valueAsNumber < 0) {
      document.getElementById('eventPriceErr').innerText = 'Please select between 0 and $2000.';
    } else if (evt.target.value.length === 0) {
      this.eventForm.patchValue({eventPrice: 0});
      document.getElementById('eventPriceErr').innerText = '';
    }
    if (evt.target.valueAsNumber <= 2000 && evt.target.valueAsNumber > 0) {
      document.getElementById('eventPriceErr').innerText = '';
    }
  }

  public onEvenActionLinkChange(e) {
    if (e.target.value.length > 255) {
      document.getElementById('eventLinkErr').innerText = 'Length of your link must be less than 255';
    } else {
      document.getElementById('eventLinkErr').innerText = '';
    }
  }

  public markAsTouchPlace() {
    this.eventForm.controls.eventPlace.markAsTouched();
  }

  public onMapsChangePlace(data) {
    // get lat long from place id
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({placeId: data.place_id}, (results, status) => {
      if (status.toString() === 'OK') {
        // set lat long for eventPlace
        this.eventForm.controls.eventPlace.patchValue({
          place: data.description,
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
      }

      // hide result
      this.eventForm.controls.eventPlace.markAsTouched();
      this.hyperSearchComponent.hideSearchResult = true;
    });
  }

  public onHyloChangePlace(data) {
    this.eventForm.controls.eventPlace.patchValue({
      place: data.Title,
      lat: Number(data.Lat),
      lng: Number(data.Long),
    });
    this.eventForm.controls.eventPlace.markAsTouched();
    this.hyperSearchComponent.hideSearchResult = true;
  }

  public onRemovePreview(imageUrl) {
    let imageId = this.previewUrls.indexOf(imageUrl);
    delete this.previewUrls[imageId];
    this.previewUrls = this.previewUrls.filter((img) => img !== imageUrl);
    if (this.previewUrls.length < 4) {
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
    if (event.target.files && event.target.files[0] && this.previewUrls.length < 4) {
      let typeFile = new RegExp(/\/(jpe?g|png|gif|bmp)$/, 'i');
      for (let i = 0; i < event.target.files.length && i < 4; i++) {
        let size = event.target.files[i].size;
        let type = event.target.files[i].type;
        if (size < 6291456 && typeFile.test(type)) {
          reader[i] = new FileReader();
          reader[i].onload = (e) => {
            let image = new Image();
            image.src = e.target.result;

            this.resizeImage(image, 480, 330, (resizedImage) => {
              let img: Image = {
                url: resizedImage,
                value: e.target.result.replace(/^data:image\/\S+;base64,/, ''),
                filename: event.target.files[i].name,
                filemime: event.target.files[i].type,
                filesize: event.target.files[i].size,
                fid: -1
              };
              if (this.previewUrls.length < 4) {
                this.previewUrls.push(img);
              }
              if (this.previewUrls.length >= 4) {
                this.addImage = false;
              }
            });
          };
          reader[i].readAsDataURL(event.target.files[i]);
        } else {
          this.validSize = false;
          this.validType = false;
        }
      }
    }
  }

  public addPrice() {
    const prices = this.eventForm.get('eventPrices') as FormArray;
    prices.push(new FormControl());
  }

  public addMention() {
    const mentions = this.eventForm.get('eventMentions') as FormArray;
    mentions.push(new FormControl());
  }

  public switchView() {
    this.showPreview = !this.showPreview;
  }

  public onSubmit(): void {
    if (this.submitted) {
      return;
    }
    this.submitted = true;
    let event = this.eventForm.value;
    event.eventImages = this.previewUrls;
    event.eventTags = this.processTags(event.eventTags);
    event.startDate = (event.eventStartDate) ? moment(event.eventStartDate).unix() : moment(new Date()).unix();
    event.endDate = (event.eventEndDate) ? moment(event.eventEndDate).unix() : moment(new Date()).unix();
    let data = mapEvent(event);
    this.loaderService.show();
    this.eventService.postEvent(data).subscribe(
      (response: any) => {
        this.loaderService.hide();
        this.submitted = false;
        this.router.navigate([response.data.slug]).then();
      },
      (error) => {
        console.log(error);
        this.loaderService.hide();
      }
    );
  }

  public onPreview() {
    let event = this.eventForm.value;
    event.eventTags = this.processTags(event.eventTags);
    event.eventImages = this.previewUrls;
    event.startDate = (event.eventStartDate) ? moment(event.eventStartDate).unix() : moment(new Date()).unix();
    event.endDate = (event.eventEndDate) ? moment(event.eventEndDate).unix() : moment(new Date()).unix();
    this.prices = [];
    for (let price of event.eventPrices) {
      if (price) {
        this.prices.push(price);
      }
    }
    this.previewData = event;
    this.initPreview();
  }

  public initPreview() {
    this.showPreview = true;
    this.slides = [];
    for (let img of this.previewUrls) {
      if (img) {
        this.slides.push({image: img.url, active: false});
      }
    }
  }

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

  private processTags(tags) {
    for (let tag of tags) {
      let addTag = this.tags.filter(
        (term) => term.name === tag
      );
      if (!addTag[0]) {
        addTag[0] = {
          tid: -1,
          name: tag
        };
      }
      this.checkTags.push(addTag[0]);
    }
    return this.checkTags;
  }
}

function mapEvent(event) {
  return {
    title: event.eventName,
    body: event.eventDetail,
    created: event.startDate,
    field_images: event.eventImages,
    field_event_category: event.eventCategory,
    field_event_tags: event.eventTags,
    field_organized: event.eventOrganized,
    field_location_place: [{
      field_latitude: event.eventPlace.lat,
      field_longitude: event.eventPlace.lng,
      field_location_address: event.eventPlace.place
    }],
    field_event_option: [{
      field_call_to_action_group: event.call2action.eventType,
      field_call_to_action_link: event.call2action.eventLink,
      field_price: event.eventPrices,
      field_mentioned_by: event.eventMentions,
      field_end_date_time: event.endDate
    }]
  };
}
