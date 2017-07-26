import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { EventService } from '../../services/event.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { WindowUtilService } from '../../services/window-ultil.service';

import { AppSetting } from '../../app.setting';
import { Call2Action, Experience, HyloEvent, Icon, Location, BaseUser, Image, User } from '../../app.interface';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class EventDetailComponent implements HyloEvent, OnInit {

  @ViewChild('msgInput') public msgInput: ElementRef;

  public id: number;
  public creator: BaseUser;
  public name: string = '';
  public location: Location = {name: '', lat: 0, lng: 0};
  public detail: string = '';
  public category: any;
  public startDate: number = 0;
  public endDate: number = 0;
  public price: number = 0;
  public call2action: Call2Action = {action: '', link: ''};
  public mentions: Icon[] = [];
  public images: Image[] = [];
  public rating: number = 0;
  public organized: string = '';
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
  public layoutWidth: number;
  public innerWidth: number;

  public experienceForm: FormGroup = this.formBuilder.group({
    listName: ['', Validators.required],
    listDescription: ['', Validators.required],
    listCategory: ['', Validators.email],
    images: ['', Validators.required],
    listPlaces: this.formBuilder.array([])
  });

  constructor(public localStorageService: LocalStorageService,
              public eventService: EventService,
              public formBuilder: FormBuilder,
              public rateConfig: NgbRatingConfig,
              private route: ActivatedRoute,
              private router: Router,
              public sanitizer: DomSanitizer,
              private loaderService: LoaderService,
              private windowRef: WindowUtilService) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(this.windowRef.rootContainer);
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 181) / 2;
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
        },
        (error) => {
          console.log(error);
          this.loaderService.hide();
        },
        () => {
          this.loaderService.hide();
          if (e.notification === 'comment') {
            let interval = window.setInterval(() => {
              document.getElementById('createComment').scrollIntoView();
              window.clearInterval(interval);
              document.getElementById('createComment').removeAttribute('id');
            }, 200);
          }
        }
      );
    });
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 181) / 2;
    this.initRating();
  }

  public checkLogin(): void {
    if (this.user.isAnonymous) {
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
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.price = event.price;
    this.call2action = event.call2action;
    this.mentions = event.mentions;
    this.images = event.images;
    this.rating = event.rating;
    this.organized = event.organized;
    this.userRated = event.userRated;
    this.experiences = event.experiences;
  }

  private initSlide(images) {
    this.slides = [];
    for (let image of images) {
      this.slides.push({image: image.url});
    }
  }

  private initRating() {
    this.rateConfig.max = 5;
    this.rateConfig.readonly = false;
  }
}
