import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as moment from 'moment/moment';
import { AppState } from '../../app.service';
import { EventService } from '../../services/event.service';

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
  public categories: any[];
  public previewUrl: any[] = [];
  public showMore: boolean = false;
  public showPreview: boolean = false;
  public slides: any[] = [];
  public types = [
    { value: '1', display: 'Buy Ticket' },
    { value: '2', display: 'More info' }
  ];
  constructor(public fb: FormBuilder, private eventService: EventService,
              public appState: AppState, private router: Router) {
    this.eventService.getCategoryEvent().then(
      (response) => this.categories = response.data
    );
  }

  public ngOnInit() {
    // TODO
  }

  public onRemovePreview(imageUrl) {
    let imageId = this.previewUrl.indexOf(imageUrl);
    delete this.previewUrl[imageId];
    this.previewUrl = this.previewUrl.filter((img) => img !== imageUrl);
  }

  public readUrl(event) {
    let reader = [];
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        reader[i] = new FileReader();
        reader[i].onload = (e) => {
          let img = {
            url: e.target.result,
            value: e.target.result.replace(/^data:image\/\S+;base64,/, ''),
            filename: event.target.files[i].name,
            filemime: event.target.files[i].type
          };

          this.previewUrl.push(img);
        };
        reader[i].readAsDataURL(event.target.files[i]);
      }
    }
  }

  public resize(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {
    // This will wait until the img is loaded before calling this function
    return img.onload = () => {

      // Get the images current width and height
      let width = img.width;
      let height = img.height;

      // Set the WxH to fit the Max values (but maintain proportions)
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      // create a canvas object
      let canvas = document.createElement('canvas');

      // Set the canvas to the new calculated dimensions
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0,  width, height);

      // Get this encoded as a jpeg
      // IMPORTANT: 'jpeg' NOT 'jpg'
      let dataUrl = canvas.toDataURL('image/jpeg');

      // callback with the results
      callback(dataUrl, img.src.length, dataUrl.length);
    };
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
    this.eventService.postEvent(data).then((response) => {
      if (response.status) {
        this.router.navigate([response.data.slug]);
      }
    });
  }

  public onPreview() {
    let event = this.eventForm.value;
    event.eventImages = this.previewUrl;
    this.appState.set('eventPreview', event);
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
