import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { slideInOutAnimation } from '../../animations/slide-in-out.animation';
import * as moment from 'moment/moment';
import { BaseUser, Company, Experience, Image, Location } from '../../app.interface';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../../services/main.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { AppSetting } from '../../app.setting';
@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
  animations: [slideInOutAnimation],
})
export class CompanyDetailComponent implements Company, OnInit {
  public id: string;
  public name: string;
  public description: string;
  public rating: number;
  public location: Location;
  public website: string;
  public phone: string;
  public openingHours: string[];
  public reviews: Experience[] = [];
  public images: Image[];
  public slugName: string;
  public user: BaseUser = {name: '', avatar: ''};
  public commentPosition = 'out';
  public companyStatus = 'default';
  public showForm = false;
  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public slides = [];
  public ready: boolean = false;
  public descTruncated: boolean = true;
  public bookmarked: boolean = false;
  public rated: boolean = false;
  public company: Company;
  public gMapStyles: any;

  constructor(
    public mainService: MainService,
    public companyService: CompanyService,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {}

  public ngOnInit() {
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.route.params.subscribe((e) => {
      this.slugName = e.slug;
      this.loaderService.show();
      this.companyService.getCompanyDetail(this.slugName).subscribe(
        (resp) => {
          this.company = CompanyService.extractCompanyDetail(resp);
          this.loadData(this.company);
          this.initSlide(this.images);
          this.ready = true;
          this.loaderService.hide();
        },
        (error) => {
          console.log(error);
        }
      );
    });
    this.mainService.getUserProfile().then((response) => {
      this.user.name = response.name;
      this.user.avatar = response.field_image;
    });
  }

  public toggleBookmark() {
    let bookmarked = !this.bookmarked;
    this.companyService.toggleBookmark(this.id).subscribe(
      (resp) => {
        console.log(resp);
        this.bookmarked = bookmarked;
      },
      (error) => {
        console.log(error);
      }
    );
  };

  public viewReviews() {
    this.commentPosition = 'in';
    this.companyStatus = 'hidden';
  }

  public showReviewModal() {
    this.showForm = true;
  }

  public goBack() {
    this.commentPosition = 'out';
    this.companyStatus = 'default';
  }

  public postReview(data) {
    if (data === false) {
      this.showForm = false;
    }
    if (!this.rated && data.text) {
      let review: Experience = {
        id: 0,
        author: this.user,
        rating: data.rating,
        date: moment().unix() * 1000,
        text: data.text,
        images: data.images,
        comments: [],
        likeNumber: 0,
        liked: false
      };
      this.showForm = false;
      this.rated = true;
      this.loaderService.show();
      this.companyService.postReview(this.id, review).subscribe(
        (resp: Experience) => {
          console.log('review:', resp);
          this.reviews.unshift(resp);
          this.loaderService.hide();
        },
        (error) => {
          console.log(error);
          this.rated = false;
        }
      );
    }
  }

  public showMore() {
    this.descTruncated = false;
  }

  public showLess() {
    this.descTruncated = true;
  }

  public onLikeReview(item: Experience): void {
    this.companyService.toggleLike(item).subscribe(
      (resp) => {
        console.log(resp);
        item.liked = resp;
        item.likeNumber += resp ? 1 : -1;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private loadData(data) {
    this.id = data.id;
    this.images = data.images;
    this.website = data.website;
    this.reviews = data.reviews;
    this.name = data.name;
    this.description = data.description;
    this.rating = data.rating;
    this.rated = data.rated;
    this.bookmarked = data.bookmarked;
    this.phone = data.phone;
    this.openingHours = data.openingHours;
    this.location = data.location;
  }

  private initSlide(images) {
    for (let image of images) {
      this.slides.push({image: image.url});
    }
    if (!this.slides.length) {
      this.slides.push({image: 'assets/img/company/detail/default-company.jpg'});
    }
  }

}
