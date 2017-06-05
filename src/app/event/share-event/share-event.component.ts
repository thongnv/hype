import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as moment from 'moment/moment';
import { MainService } from '../../services/main.service';
import { AppState } from '../../app.service';

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
    eventDate: ['', Validators.required],
    eventPrice: ['', Validators.required],
    call2action: this.fb.group({
      eventType: ['buy', Validators.required],
      eventLink: ['', Validators.required],
    }),
    eventImages: ['', Validators.required],
    eventMentions: this.fb.array(['']),
  });
  public categories: any[] = [
    {
      id: 1,
      name: 'Category 1'
    },
    {
      id: 2,
      name: 'Category 2'
    },
    {
      id: 3,
      name: 'Category 3'
    },
  ];
  public previewUrl: string[] = [];
  public showMore: boolean = false;
  public showPreview: boolean = false;
  public slides: any[] = [];
  public types = [
    { value: 'buy', display: 'Buy Ticket' },
    { value: 'more', display: 'More info' }
  ];
  constructor(public fb: FormBuilder, private mainService: MainService,
              public appState: AppState, private router: Router) {
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
          this.previewUrl.push(e.target.result);
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
    this.router.navigate(['/event/1']);
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
        this.slides.push({image: img, active: false});
      }
    }
  }
}
