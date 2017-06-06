import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment/moment';

import { Call2Action, Experience, HyloEvent, Icon, Location, BaseUser } from '../../app.interface';
import { AppState } from '../../app.service';
import { EventService } from '../../services/event.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class EventDetailComponent implements HyloEvent, OnInit {

  @ViewChild('msgInput') public msgInput: ElementRef;

  public creator: BaseUser = {name: '', avatar: ''};
  public name: string = '';
  public location: Location = {name: '', lat: 0, lng: 0};
  public detail: string = '';
  public category: string = '';
  public date: number = 0;
  public price: string = '';
  public call2action: Call2Action = {action: '', link: ''};
  public mentions: Icon[] = [];
  public images: string[] = [];
  public rating: number = 0;
  public experiences: Experience[] = [];

  public user: BaseUser = {name: '', avatar: ''};
  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public noThumbnail: boolean = false;
  public slides = [];

  public previewUrl: string[] = [];

  public userRating: number = 0;
  public userRated: boolean = false;

  public mapReady: boolean = false;

  public experienceForm: FormGroup = this.formBuilder.group({
    listName: ['', Validators.required],
    listDescription: ['', Validators.required],
    listCategory: ['', Validators.email],
    images: ['', Validators.required],
    listPlaces: this.formBuilder.array([])
  });

  constructor(
    private appState: AppState,
    public eventService: EventService,
    public formBuilder: FormBuilder,
    public rateConfig: NgbRatingConfig
  ) {
    this.eventService.getEventDetail().then((resp) => {
      let event = EventService.extractEventDetail(resp);
      this.initEvent(event);
      this.initSlide(this.images);
      this.mapReady = true;
    });
  }

  public ngOnInit() {
    this.user = this.appState.state.userInfo;
    this.initRating();
  }

  public onClickFocusMsgInput() {
    this.msgInput.nativeElement.focus();
  }

  public addExperience(msgInput) {
    let experience: Experience = {
      author: this.user,
      text: msgInput.value,
      likeNumber: 0,
      liked: false,
      comments: [],
      rating: this.userRating,
      date: moment().unix(),
      images: [
        '/assets/img/event/detail/abc.jpg',
        '/assets/img/event/detail/abc.jpg',
      ]
    };
    this.experiences.push(experience);
    msgInput.value = '';
    this.userRated = true;
  }

  public onSubmit() {
    let userDraftList = {
      info: this.experienceForm.value,
      images: this.previewUrl
    };
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

  private initEvent(event) {
    this.creator = event.creator;
    this.name = event.name;
    this.location = event.location;
    this.detail = event.detail;
    this.category = event.category;
    this.date = event.date;
    this.price = event.price;
    this.call2action = event.call2action;
    this.mentions = event.mentions;
    this.images = event.images;
    this.rating = event.rating;
    this.experiences = event.experiences;
  }

  private initSlide(images) {
    for (let image of images) {
      this.slides.push({image});
    }
  }

  private initRating() {
    this.rateConfig.max = 5;
    this.rateConfig.readonly = false;
  }

}
