import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { ExperienceComponent } from './experience.component';
import { AppState } from '../../app.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {
  public images: string[];
  public company: any;

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
    this.initSlide();
  }

  private initSlide() {
    for (let image of this.images) {
      this.slides.push({image});
    }
  }

}
