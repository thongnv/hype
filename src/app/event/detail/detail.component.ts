import { Component, OnInit } from '@angular/core';
import { HyloEvent, User } from '../../app.interface';
import { AppState } from '../../app.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class EventDetailComponent implements OnInit {

  public NextPhotoInterval: number = 5000;
  public noLoopSlides: boolean = false;
  public noTransition: boolean = false;

  public slides = [];
  public event: HyloEvent;
  private user: User;

  constructor(private appState: AppState, private eventService: EventService) {
    this.event = eventService.getEvent('123');
    this.user = this.appState.state.userInfo;
    this.addNewSlide();
  }

  public ngOnInit() {
    // TODO
  }

  private addNewSlide() {
    for (let image of this.event.images) {
      this.slides.push({image});
    }
  }

}
