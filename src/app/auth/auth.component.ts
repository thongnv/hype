import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { AppSetting } from '../app.setting';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { AppState } from '../app.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private userInfo = {
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
  private initParams: InitParams;

  constructor(private fb: FacebookService,
              private mainService: MainService,
              private router: Router,
              private localStorageService: LocalStorageService) {

    this.initParams = AppSetting.FACEBOOK;
  }

  public loginWithOptions() {

    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile,user_friends,email,pages_show_list'
    };

    this.fb.login(loginOptions)
      .then((res: LoginResponse) => {
        console.log('Logged in FB: ', res);
        this.mainService.login(res.authResponse.accessToken).then((respone) => {
          this.localStorageService.set('loginData', JSON.stringify(respone));
          console.log('login-respone: ', respone);
          this.router.navigate(['/' + respone.current_user.slug]);
        });
      })
      .catch(this.handleError);
  }

  public ngOnInit() {
    console.log('login initial');
    this.fb.init(this.initParams);
  }

  private handleError(error) {
    console.error('Error processing action', error);
  }

}
