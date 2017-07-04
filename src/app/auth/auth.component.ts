import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { AppSetting } from '../app.setting';
import { MainService } from '../services/main.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { User } from '../app.interface';
import * as moment from 'moment';
import _date = moment.unitOfTime._date;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  public ready = false;
  private user = this.localStorageService.get('user');
  private initParams: InitParams = AppSetting.FACEBOOK;

  constructor(private facebookService: FacebookService,
              private mainService: MainService,
              private localStorageService: LocalStorageService) {
  }

  public ngOnInit() {
    if (this.user) {
      window.location.href = '/home';
    } else {
      this.facebookService.init(this.initParams).then();
      this.ready = true;
    }
  }

  public onClickLogin() {
    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile,user_friends,email,pages_show_list'
    };
    this.facebookService.login(loginOptions).then(
      (loginRes: LoginResponse) => {
        console.log(loginRes);
        this.mainService.login(loginRes.authResponse.accessToken).subscribe(
          (resp: any) => {
            let data = resp.current_user;
            let user: User = {
              id: data.uid,
              firstName: data.field_first_name,
              lastName: data.field_last_name,
              name: data.field_first_name + ' ' + data.field_last_name,
              contactNumber: null,
              followingNumber: null,
              followerNumber: null,
              email: '',
              userFollowing: [],
              userFollower: [],
              showNav: true,
              acceptNotification: true,
              slug: data.slug,
              avatar: data.avatar,
              isAnonymous: false
            };
            this.localStorageService.set('user', user);
            this.localStorageService.set('csrf_token', resp.csrf_token);
            window.location.reload();
          },
          (error) => {
            console.log(error);
          });
      });
  }

}
