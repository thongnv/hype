import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { AppState } from './app.service';
import { LocalStorageService } from 'angular-2-local-storage';

import { SeoService } from './services/seo.service';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

  public user = this.localStorageService.get('user');

  constructor(public appState: AppState,
              private localStorageService: LocalStorageService,
              private seoService: SeoService) {
    // set meta data for seo
    this.seoService.setSEOMetaTags(
      'Hylo - Discover things to do in Singapore today', 'Hylo corp',
      'hylo, food, hylo food, promote events', 'Description'
    );

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
    if (this.appState.state.user === undefined) {
      this.appState.set('user', this.userInfo);
    }
  }

}
