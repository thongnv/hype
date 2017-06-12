import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { AppState } from '../../app.service';
import { slideInOutAnimation } from '../../animations/slide-in-out.animation';
import * as moment from 'moment/moment';
import { BaseUser, Company, Experience, Image, Location } from '../../app.interface';
@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
  animations: [slideInOutAnimation],
})
export class CompanyDetailComponent implements Company, OnInit {
  public name: string;
  public description: string;
  public rating: number;
  public location: Location;
  public website: string;
  public phone: string;
  public openingHours: string[];
  public reviews: Experience[] = [];
  public images: Image[];
  public company: Company;
  public user: BaseUser;
  public commentPosition = 'out';
  public companyStatus = 'default';
  public showForm = false;
  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public slides = [];

  constructor(private appState: AppState, public companyService: CompanyService) {}

  public ngOnInit() {
    this.company = this.companyService.getCompany('123');
    this.loadData(this.company);
    let user = this.appState.state.userInfo;
    this.user = {name: 'Tom Cruise', avatar: user.userAvatar};
    this.initSlide(this.images);
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

  public updateReview(event) {
    if (event === false) {
      this.showForm = false;
    }
    if (event.text) {
      let review: Experience = {
        id: 0,
        author: this.user,
        rating: event.rating,
        date: moment().unix(),
        text: event.text,
        images: extractImages(event.images),
        comments: [],
        likeNumber: 0,
        liked: false
      };
      this.reviews.push(review);
      this.showForm = false;
    }
  }

  private loadData(data) {
    this.images = data.images;
    this.website = data.website;
    this.reviews = data.reviews;
    this.name = data.name;
    this.description = data.description;
    this.rating = data.rating;
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

function extractImages(data) {
  let images: Image[] = [];
  for (let i of data) {
    images.push({
      url: i,
      value: '',
      filename: '',
      filemime: '',
      filesize: 0,
    });
  }
  return images;
}
