import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { AppState } from './app.service';
import { LocalStorageService } from 'angular-2-local-storage';

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
  public loginData = {};

  constructor(
    public appState: AppState,
    private localStorageService: LocalStorageService
  ) {
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
  }

  public ngOnInit(): void {
    this.loginData = JSON.parse(<string> this.localStorageService.get('loginData'));
    console.log('Initial App State 1', this.appState.state.userInfo);
    if (this.appState.state.userInfo === undefined) {
      this.appState.set('userInfo', this.userInfo);
    }
    console.log('Initial App State 2', this.appState.state.userInfo);
  }

}
