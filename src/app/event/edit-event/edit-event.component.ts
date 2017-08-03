import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

import * as moment from 'moment/moment';
import { EventService } from '../../services/event.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { AppSetting } from '../../app.setting';

import { HyperSearchComponent } from '../../hyper-search/hyper-search.component';
import { LocalStorageService } from 'angular-2-local-storage';
import { HyloEvent, Image, User } from '../../app.interface';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  public eventForm: FormGroup = this.formBuilder.group(
    {
      name: ['', Validators.required],
      detail: ['', Validators.required],
      category: ['', Validators.required],
      tags: this.formBuilder.array(['']),
      place: this.formBuilder.group(
        {
          name: ['', Validators.required],
          lat: [''],
          lng: [''],
        }
      ),
      startDate: [''],
      endDate: [''],
      prices: this.formBuilder.array(['']),
      call2action: this.formBuilder.group(
        {
          action: [''],
          link: ['', Validators.maxLength(255)],
        }
      ),
      images: [''],
      organizer: [''],
      mentions: this.formBuilder.array([]),
    }
  );

  public event: HyloEvent;
  public user: User;

  public previewData: any;
  public categories: any[];
  public previewUrls: Image[] = [];

  public canAddMoreImages = true;

  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public showMore: boolean = true;
  public showPreview: boolean = false;
  public slides = [];
  public actions = [];
  public gMapStyles: any;
  public validCaptcha = false;

  public startDate: Date;
  public endDate: Date;
  public today = new Date();

  public prices = [];
  public tags = [];

  public submitted: boolean = false;
  public ready = false;

  @ViewChild(HyperSearchComponent)
  private hyperSearchComponent: HyperSearchComponent;

  constructor(public formBuilder: FormBuilder,
              private eventService: EventService,
              public sanitizer: DomSanitizer,
              private localStorageService: LocalStorageService,
              private loaderService: LoaderService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.loaderService.show();
    this.user = this.localStorageService.get('user') as User;
    if (!this.user) {
      this.router.navigate(['/login'], {skipLocationChange: true}).then();
    }
    this.route.params.subscribe((e) => {
      this.loaderService.show();
      this.eventService.getEventDetail(e.slug).subscribe(
        (resp) => {
          this.event = EventService.extractEventDetail(resp);
          this.eventForm.controls.place.patchValue(
            {
              name: this.event.location.name,
              lat: this.event.location.lat,
              lng: this.event.location.lng,
            }
          );
          this.startDate = new Date(this.event.startDate);
          this.endDate = new Date(this.event.endDate);
          this.previewUrls = this.event.images;
          this.actions = [this.event.call2action];
          this.eventForm.controls.mentions = this.formBuilder.array(this.event.mentions);
          this.eventForm.controls.tags = this.formBuilder.array(this.event.tags);
          this.eventService.getCategoryEvent().subscribe(
            (response) => {
              this.categories = response.data;
              this.ready = true;
              this.loaderService.hide();
            }
          );
        },
        (error) => console.log(error)
      );
    });
    this.gMapStyles = AppSetting.GMAP_STYLE;
  }

  public onSubmit(): void {
    if (!this.submitted) {
      this.submitted = true;
      let event = this.eventForm.value;
      event.images = this.previewUrls;
      event.created = moment(event.date).unix();
      let data = mapEvent(event);
      this.loaderService.show();
      this.eventService.postEvent(data).subscribe(
        (response: any) => {
          if (response.status) {
            this.loaderService.hide();
            this.submitted = false;
            this.router.navigate([response.data.slug]).then();
          }
        },
        (error) => {
          console.log(error);
          this.submitted = false;
          this.loaderService.hide();
        }
      );
    }
  }

  public onStartDateChange() {
    if (this.startDate > this.endDate) {
      this.endDate = this.startDate;
    }
  }

  public onPriceChange(evt) {
    if (evt.target.valueAsNumber > 300 || evt.target.valueAsNumber < 0) {
      document.getElementById('eventPriceErr').innerText = 'Price($) is a number between 0-300';
    } else if (evt.target.value.length === 0) {
      this.eventForm.patchValue({price: 0});
      document.getElementById('eventPriceErr').innerText = '';
    }
    if (evt.target.valueAsNumber <= 300 && evt.target.valueAsNumber > 0) {
      document.getElementById('eventPriceErr').innerText = '';
    }
  }

  public onMapsChangePlace(data) {
    // get lat long from place id
    let geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({placeId: data.place_id}, (results, status) => {
      if (status.toString() === 'OK') {
        this.eventForm.controls.place.patchValue(
          {
            place: data.structured_formatting.main_text,
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }
        );
      }
      this.hyperSearchComponent.hideSearchResult = true;
    });
  }

  public onHyloChangePlace(data) {
    this.eventForm.controls.place.patchValue({
      place: data.Title,
      lat: Number(data.Lat),
      lng: Number(data.Long),
    });
    this.hyperSearchComponent.hideSearchResult = true;
  }

  public onRemovePreview(imageUrl) {
    let imageId = this.previewUrls.indexOf(imageUrl);
    delete this.previewUrls[imageId];
    this.previewUrls = this.previewUrls.filter((img) => img !== imageUrl);
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
                fid: null
              };
              if (this.previewUrls.length < 4) {
                this.previewUrls.push(img);
              }
              if (this.previewUrls.length >= 4) {
                this.canAddMoreImages = false;
              }
            });
          };
          reader[i].readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  public addPrice() {
    const prices = this.eventForm.get('prices') as FormArray;
    prices.push(new FormControl());
  }

  public addMention() {
    const mentions = this.eventForm.get('mentions') as FormArray;
    mentions.push(new FormControl());
  }

  public switchView() {
    this.showPreview = !this.showPreview;
  }

  public onPreview() {
    let event = this.eventForm.value;
    event.images = this.previewUrls;
    event.Date = moment(event.date).unix();
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

function mapEvent(event) {
  return {
    title: event.name,
    body: event.detail,
    created: event.created,
    field_images: event.images,
    field_event_category: event.category,
    field_location_place: [{
      field_latitude: event.place.lat,
      field_longitude: event.place.lng,
      field_location_address: event.place.place
    }],
    field_event_option: [{
      field_call_to_action_group: event.call2action.action,
      field_call_to_action_link: event.call2action.link,
      field_price: event.price,
      field_mentioned_by: event.mentions
    }]
  };
}
