import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { ExperienceComponent } from './experience.component';
import { AppState } from '../../app.service';
import { slideInOutAnimation } from '../../animations/slide-in-out.animation';
import * as moment from 'moment/moment';
@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
  animations: [slideInOutAnimation],
})
export class CompanyDetailComponent implements OnInit {
  public images: string[];
  public company: any;
  public reviews: any;
  public user: any;
  public commentPosition = 'out';
  public companyStatus = 'default';
  public showForm = false;

  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;
  public slides = [];

  constructor(private appState: AppState, public companyService: CompanyService) {
    // TODO
  }

  public ngOnInit() {
    this.company = this.companyService.getCompany('123');
    this.images = this.company.images;
    this.reviews = this.company.reviews;
    this.user = this.appState.state.userInfo;
    this.initSlide();
  }

  public viewReviews() {
    this.commentPosition = 'in';
    this.companyStatus = 'hidden';
  }

  public showComment() {
    this.showForm = true;
  }

  public backCompany() {
    this.commentPosition = 'out';
    this.companyStatus = 'default';
  }

  public updateReview(event) {
    if (event === false) {
      this.showForm = false;
    }

    if (event.text) {
      event.date = moment().unix();
      event.user = this.user;
      this.reviews.push(event);
      this.showForm = false;
    }
  }

  private initSlide() {
    for (let image of this.images) {
      this.slides.push({image});
    }
  }

}
