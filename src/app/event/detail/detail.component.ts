import { Component, OnInit } from '@angular/core';
import { Call2Action, Experience, HyloEvent, Icon, User, Location } from '../../app.interface';
import { AppState } from '../../app.service';
import { EventService } from '../../services/event.service';
import { ExperienceComponent } from './experience.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class EventDetailComponent implements HyloEvent, OnInit {

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

  constructor(private appState: AppState, public eventService: EventService) {
    // TODO
  }

  public ngOnInit() {
    let event = this.eventService.getEvent('123');
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
    this.user = this.appState.state.userInfo;
    this.initSlide();
  }

  public addExperience(experience: ExperienceComponent) {
    this.experiences.push(experience);
  }

  private initSlide() {
    for (let image of this.images) {
      this.slides.push({image});
    }
  }

}
