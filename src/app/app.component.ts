import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Title } from '@angular/platform-browser';
import { AppState } from './app.service';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

  public userInfo = {
    userName: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    userAvatar: 'assets/img/avatar/demoavatar.png',
    followingNumber: 0,
    followerNumber: 0,
    receiveEmail: 0,
    userFollowing: [
    ],
    userFollower: [
    ],
    showNav: true,
    acceptNotification: true
  };

  constructor(public appState: AppState, private titleService: Title) {
    titleService.setTitle('Hylo');
  }

  public ngOnInit(): void {
    this.demo();
    console.log('Initial App State', this.appState.state);
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  public demo(): void {
    this.appState.set('userInfo', this.userInfo);
  }
}
