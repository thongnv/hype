import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { MainService } from '../../services/main.service';
import { EventService } from '../../services/event.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';

import { AppSetting } from '../../app.setting';
import {
Call2Action, Experience, HyloEvent, Icon, Location, BaseUser, Image, User
} from '../../app.interface';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class EventDetailComponent implements HyloEvent, OnInit {

  @ViewChild('msgInput') public msgInput: ElementRef;

  public id: number;
  public creator: BaseUser = {name: '', avatar: '', slug: '', isAnonymous: false};
  public name: string = '';
  public location: Location = {name: '', lat: 0, lng: 0};
  public detail: string = '';
  public category: string = '';
  public date: number = 0;
  public price: number = 0;
  public call2action: Call2Action = {action: '', link: ''};
  public mentions: Icon[] = [];
  public images: Image[] = [];
  public rating: number = 0;
  public experiences: Experience[] = [];
  public user = AppSetting.defaultUser;
  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public noThumbnail: boolean = false;
  public slides = [];
  public previewUrl: Image[] = [];
  public userRating: number = 0;
  public userRated: boolean = false;
  public ready: boolean = false;
  public slugName = '';
  public gMapStyles: any;

  public experienceForm: FormGroup = this.formBuilder.group({
    listName: ['', Validators.required],
    listDescription: ['', Validators.required],
    listCategory: ['', Validators.email],
    images: ['', Validators.required],
    listPlaces: this.formBuilder.array([])
  });

  constructor(public localStorageService: LocalStorageService,
              public mainService: MainService,
              public eventService: EventService,
              public formBuilder: FormBuilder,
              public rateConfig: NgbRatingConfig,
              private route: ActivatedRoute,
              private router: Router,
              public sanitizer: DomSanitizer,
              private loaderService: LoaderService) {
  }

  public ngOnInit() {
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.route.params.subscribe((e) => {
      this.slugName = e.slug;
      this.loaderService.show();
      this.eventService.getEventDetail(this.slugName).subscribe(
        (resp) => {
          let event = EventService.extractEventDetail(resp);
          this.loadData(event);
          this.initSlide(this.images);
          this.ready = true;
          this.loaderService.hide();
        },
        (error) => {
          this.loaderService.hide();
          console.log(error);
        }
      );
    });
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.initRating();
  }

  public checkLogin(): void {
    if (!this.user.isAnonymous) {
      this.router.navigate(['/login'], {skipLocationChange: true}).then();
    }
  }

  public onClickFocusMsgInput() {
    this.msgInput.nativeElement.focus();
  }

  public addExperience(msgInput) {
    if (!this.userRated && msgInput.value.trim()) {
      this.loaderService.show();
      this.userRated = true;
      let slugName = this.slugName;
      let data = {
        rate: this.userRating,
        message: msgInput.value,
        comment_images: this.previewUrl
      };
      this.eventService.postExperience(slugName, data).subscribe(
        (resp: Experience) => {
          this.experiences.push(resp);
          this.experienceForm.reset();
          this.loaderService.hide();
        },
        (error) => {
          console.log(error);
          this.userRated = false;
          this.loaderService.hide();
        }
      );
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
            url: URL.createObjectURL(event.target.files[i]),
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
    this.id = event.id;
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
