import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { AppState } from '../../app.service';
import { slideInOutAnimation } from '../../animations/slide-in-out.animation';
import * as moment from 'moment/moment';
import { BaseUser, Company, Experience, Image, Location } from '../../app.interface';
import { ActivatedRoute, Router } from '@angular/router';
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
  public company: Company;
  public user: BaseUser;
  public commentPosition = 'out';
  public companyStatus = 'default';
  public showForm = false;
  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public slides = [];
  public mapReady: boolean = false;
  public descTruncated: boolean = true;
  public bookmarked: boolean = false;
  public rated: boolean = false;

  constructor(
    private appState: AppState,
    public companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit() {
    this.route.params.subscribe((e) => {
      this.slugName = e.slug;
      this.companyService.getCompanyDetail(this.slugName).subscribe(
        (resp) => {
          this.company = CompanyService.extractCompanyDetail(resp);
          this.loadData(this.company);
          this.initSlide(this.images);
          this.mapReady = true;
        },
        (error) => {
          console.log(error);
          this.router.navigate(['PageNotFound']).then();
        }
      );
    });
    let user = this.appState.state.userInfo;
    this.user = {name: 'Tom Cruise', avatar: user.userAvatar};
  }

  public toggleBookmark() {
    this.bookmarked = !this.bookmarked;
  }

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
    if (data.text) {
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
      this.companyService.postReview(this.id, review).subscribe(
        (resp) => {
          console.log(resp);
          this.reviews.unshift(review);
          this.rated = true;
        },
        (error) => {
          console.log(error);
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
  }

}
