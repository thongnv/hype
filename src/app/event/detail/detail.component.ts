import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Call2Action, Experience, HyloEvent, Icon, User, Location } from '../../app.interface';
import { AppState } from '../../app.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class EventDetailComponent implements HyloEvent, OnInit {
  @ViewChild('msgInput') public msgInput: ElementRef;

  public creator: User;
  public name: string;
  public location: Location;
  public detail: string;
  public category: string;
  public date: string;
  public price: string;
  public call2action: Call2Action;
  public mentions: Icon[];
  public images: string[];
  public rating: number;
  public experiences: Experience[];

  public user: User;
  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public noThumbnail: boolean = false;
  public slides = [];

  public previewUrl: string[] = [];

  public starRatingConfig: any;
  public userRating: number = 0;
  public userRated: boolean = false;

  public experienceForm: FormGroup = this.formBuilder.group({
    listName: ['', Validators.required],
    listDescription: ['', Validators.required],
    listCategory: ['', Validators.email],
    images: ['', Validators.required],
    listPlaces: this.formBuilder.array([])
  });

  constructor(private appState: AppState, public eventService: EventService, public formBuilder: FormBuilder) {
    // TODO
  }

  public ngOnInit() {
    this.user = {
      firstName: 'Penny',
      lastName: 'Lim',
      contactNumber: '23243',
      avatar: '/assets/img/eventdetailpage/tank.jpg',
      followingNumber: 12,
      followerNumber: 1,
      receiveEmail: 2,
      userFollowing: [],
      userFollower: [],
      showNav: true,
      acceptNotification: true,
    };
    let event: HyloEvent = this.eventService.getEvent('123');
    this.initEvent(event);
    this.initSlide();
    this.initRating();
  }

  public onClickFocusMsgInput() {
    this.msgInput.nativeElement.focus();
  }

  public addExperience(msgInput) {
    let experience: Experience = {
      user: this.user,
      text: msgInput.value,
      likeNumber: 0,
      comments: [],
      rating: this.userRating,
      date: this.formatDate(new Date()),
      images: [
        '/assets/img/eventdetailpage/abc.jpg',
        '/assets/img/eventdetailpage/abc.jpg',
      ],
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

  private initSlide() {
    for (let image of this.images) {
      this.slides.push({image});
    }
  }

  private initRating() {
    this.starRatingConfig = {};
    this.starRatingConfig.id = 1221;
    this.starRatingConfig.rating = 0;
    this.starRatingConfig.showHalfStars = false;
    this.starRatingConfig.numOfStars = 5;
    this.starRatingConfig.size = 'large';
    this.starRatingConfig.space = 'around';
    this.starRatingConfig.staticColor = 'no';
    this.starRatingConfig.disabled  = false;
    this.starRatingConfig.starType = 'svg';
    this.starRatingConfig.labelPosition = 'right';
    this.starRatingConfig.labelText = '';
    this.starRatingConfig.labelVisible = false;
    this.starRatingConfig.speed = 'slow';
    this.starRatingConfig.hoverEnabled = true;
    this.starRatingConfig.direction = 'ltr';
    this.starRatingConfig.step = 1;
    this.starRatingConfig.readOnly = false;
    this.starRatingConfig.getColor = (rating: number, numOfStars: number, staticColor?: any) => {
      return staticColor || 'ok';
    };
    this.starRatingConfig.getHalfStarVisible = (rating): boolean => {
      return Math.abs(rating % 1) > 0;
    };
    // Outputs
    this.starRatingConfig.onRatingChange = ($event) => {
      this.userRating = $event.rating;
    };
  }

  private formatDate(date) {
    let monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

}
