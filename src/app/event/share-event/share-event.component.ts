import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

import * as moment from 'moment/moment';
import { EventService } from '../../services/event.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { MainService } from '../../services/main.service';
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
    eventOrganizer: [''],
    call2action: this.fb.group({
      eventType: ['1'],
      eventLink: [''],
    }),
    eventMentions: this.fb.array(['']),
  });

  public actionTypes = [
    {value: '1', display: 'Buy Tix'},
    {value: '2', display: 'More Info'}
  ];

  public user: any;
  public previewData: any;
  public categories: any[];
  public tags: any[];
  public previewImages: any[] = [];
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

  public gMapStyles: any;
  public validCaptcha = false;
  public validSize = true;
  public validType = true;
  public submitted = false;
  public layoutWidth: number;
  public innerWidth: number;
  public prices = [];
  public isFree: boolean;
  public eventTags = [];
  public checkTags = [];

  public existEvents = [];

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
              private windowRef: WindowUtilService,
              private mainService: MainService) {
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    console.log(event);
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180);
  }

  public ngOnInit() {
    this.titleService.setTitle('Share An Event');
    this.loaderService.show();
    this.user = this.localStorageService.get('user');
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
    this.layoutWidth = (this.windowRef.rootContainer.width - 180);
  }

  public onSubmit(): void {
    if (this.submitted) {
      return;
    }
    this.submitted = true;
    let event = this.eventForm.value;
    event.eventImages = this.previewImages;
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
    window.scroll(0, 0);
    let event = this.eventForm.value;
    event.eventImages = this.previewImages;
    event.startDate = event.eventStartDate ? moment(event.eventStartDate).unix() : moment(new Date()).unix();
    event.endDate = event.eventEndDate ? moment(event.eventEndDate).unix() : moment(new Date()).unix();
    this.prices = [];
    for (let price of event.eventPrices) {
      if (price !== '') {
        this.prices.push(price);
      }
    }
    let sumPrices = this.prices.reduce((sum, value) => sum + Number(value), 0);
    this.isFree = sumPrices === 0;
    this.previewData = event;
    this.initPreview();
  }

  public initPreview() {
    this.showPreview = true;
    this.slides = [];
    for (let img of this.previewImages) {
      if (img) {
        this.slides.push({image: img.url, active: false});
      }
    }
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
    let geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({placeId: data.place_id}, (results, status) => {
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
      lat: +data.Lat || AppSetting.SingaporeLatLng.lat,
      lng: +data.Long || AppSetting.SingaporeLatLng.lng,
    });
    this.eventForm.controls.eventPlace.markAsTouched();
    this.hyperSearchComponent.hideSearchResult = true;
  }

  public onRemovePreview(imageUrl) {
    let imageId = this.previewImages.indexOf(imageUrl);
    delete this.previewImages[imageId];
    this.previewImages = this.previewImages.filter((img) => img !== imageUrl);
    if (this.previewImages.length < 4) {
      this.addImage = true;
    }
  }

  public checkCaptcha(captcha) {
    if (captcha) {
      this.validCaptcha = true;
    }
  }

  public onInputEventName(event) {
    this.existEvents = [];
    const eventName = event.target.value.trim();
    if (eventName.length > 3) {
      this.mainService.search(eventName)
        .subscribe((data) => {
          this.existEvents = data.event;
        });
    }
  }

  public readUrl(event) {
    let reader = [];
    if (event.target.files && event.target.files[0] && this.previewImages.length < 4) {
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
                fid: null,
                url: resizedImage,
                value: e.target.result.replace(/^data:image\/\S+;base64,/, ''),
                filename: event.target.files[i].name.substr(0, 50),
                filemime: event.target.files[i].type,
                filesize: event.target.files[i].size,
              };
              if (this.previewImages.length < 4) {
                this.previewImages.push(img);
              }
              if (this.previewImages.length >= 4) {
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
    this.checkTags = [];
    for (let tag of tags) {
      let addTag = this.tags.filter(
        (term) => term.name === tag
      );
      if (!addTag[0]) {
        addTag[0] = {
          tid: null,
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
    field_organized: event.eventOrganizer,
    field_location_place: [{
      fcl_id: event.call2action.fcl_id,
      field_latitude: event.eventPlace.lat,
      field_longitude: event.eventPlace.lng,
      field_location_address: event.eventPlace.place
    }],
    field_event_option: [{
      field_call_to_action_group: event.call2action.eventType,
      field_call_to_action_link: event.call2action.eventLink,
      field_price: event.eventPrices,
      field_mentioned_by: event.eventMentions,
      field_start_date_time: event.startDate,
      field_end_date_time: event.endDate
    }]
  };
}
