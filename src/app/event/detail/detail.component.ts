import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment/moment';

import { Call2Action, Experience, HyloEvent, Icon, Location, BaseUser, Image } from '../../app.interface';
import { AppState } from '../../app.service';
import { EventService } from '../../services/event.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from '../../services/main.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  public images: Image[] = [];
  public rating: number = 0;
  public experiences: Experience[] = [];
  public user: BaseUser = {name: '', avatar: ''};
  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public noThumbnail: boolean = false;
  public slides = [];
  public previewUrl: Image[] = [];
  public userRating: number = 0;
  public userRated: boolean = false;
  public mapReady: boolean = false;
  public slugName = '';

  public experienceForm: FormGroup = this.formBuilder.group({
    listName: ['', Validators.required],
    listDescription: ['', Validators.required],
    listCategory: ['', Validators.email],
    images: ['', Validators.required],
    listPlaces: this.formBuilder.array([])
  });

  constructor(
    public appState: AppState,
    public mainService: MainService,
    public eventService: EventService,
    public formBuilder: FormBuilder,
    public rateConfig: NgbRatingConfig,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((e) => {
      this.slugName = e.slug;
      this.eventService.getEventDetail(this.slugName).subscribe(
        (resp) => {
          let event = EventService.extractEventDetail(resp);
          this.loadData(event);
          this.initSlide(this.images);
          this.mapReady = true;
        },
        (error) => {
          console.log(error);
          this.router.navigate(['PageNotFound']).then();
        }
      );
    });

    this.mainService.getUserProfile().then((response) => {
      this.user.name = response.name;
      this.user.avatar = response.field_image;
    });
  }

  public ngOnInit() {
    this.initRating();
  }

  public onClickFocusMsgInput() {
    this.msgInput.nativeElement.focus();
  }

  public addExperience(msgInput) {
    if (msgInput.value.trim()) {
      let experience: Experience = {
        id: 0,
        author: this.user,
        text: msgInput.value,
        likeNumber: 0,
        liked: false,
        comments: [],
        rating: this.userRating,
        date: moment().unix() * 1000,
        images: this.previewUrl
      };
      let eventSlugName = this.slugName;
      this.eventService.postExperience(eventSlugName, experience).subscribe(
        (resp) => {
          console.log(resp);
          this.experienceForm.reset();
          this.userRated = true;
          this.rating = resp.average_rating;
        }
      );
      this.experiences.push(experience);
    }
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
            filemime: event.target.files[i].type,
            filesize: event.target.files[i].size
          };
          this.previewUrl.push(img);
        };
        reader[i].readAsDataURL(event.target.files[i]);
      }
    }
  }

  private loadData(event) {
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
    this.userRated = event.userRated;
    this.experiences = event.experiences;
  }

  private initSlide(images) {
    for (let image of images) {
      this.slides.push({image: image.url});
    }
  }

  private initRating() {
    this.rateConfig.max = 5;
    this.rateConfig.readonly = false;
  }
}
