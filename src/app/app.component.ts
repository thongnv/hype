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

  public userInfo = {};

  constructor(public appState: AppState, private titleService: Title) {
    this.userInfo = {
      isLogin: false,
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      userAvatar: 'assets/img/avatar/demoavatar.png',
      followingNumber: 0,
      followerNumber: 0,
      receiveEmail: 0,
      userFollowing: [],
      userFollower: [],
      showNav: true,
      acceptNotification: true
    };
    titleService.setTitle('Hylo');
  }

  public ngOnInit(): void {
    console.log('Initial App State 1', this.appState.state.userInfo);
    if (this.appState.state.userInfo === undefined) {
      this.appState.set('userInfo', this.userInfo);
    }
    console.log('Initial App State 2', this.appState.state.userInfo);
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  public demo(): void {
    this.appState.set('userInfo', this.userInfo);
  }
}
