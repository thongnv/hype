import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';
import { User } from '../app.interface';
import * as moment from 'moment';
import _date = moment.unitOfTime._date;
import { UserService } from '../services/user.service';
import { Title } from '@angular/platform-browser';
import { LoaderService } from '../helper/loader/loader.service';
import { Router } from '@angular/router';
import { AppGlobals } from '../services/app.global';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  public ready = false;
  public accountDisabled = false;
  public insufficientGrantedScope = false;
  private user = this.localStorageService.get('user');
  private initParams: InitParams = AppSetting.FACEBOOK;
  private loading = false;

  constructor(private facebookService: FacebookService,
              private router: Router,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private loaderService: LoaderService,
              private titleService: Title,
              private appGlobal: AppGlobals) {
  }

  public ngOnInit() {
    this.titleService.setTitle('Login');
    this.appGlobal.emitActiveType('');
    if (this.user) {
      window.location.href = '/home';
    } else {
      this.facebookService.init(this.initParams).then();
      this.ready = true;
    }
  }

  public onClickLogin() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.loaderService.show();
    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile,user_friends,email,pages_show_list'
    };
    this.facebookService.login(loginOptions).then(
      (loginRes: LoginResponse) => {
        console.log(loginRes);
        if (loginRes.authResponse.grantedScopes.indexOf('email') !== -1) {
          this.userService.login(loginRes.authResponse.accessToken).subscribe(
            (resp: any) => {
              let data = resp.current_user;
              let user: User = {
                id: data.uid,
                firstName: data.field_first_name,
                lastName: data.field_last_name,
                name: data.field_first_name + ' ' + data.field_last_name,
                contactNumber: '',
                country: '',
                followingNumber: 0,
                followerNumber: 0,
                email: '',
                followings: [],
                followers: [],
                followed: false,
                showNav: true,
                acceptNotification: true,
                slug: data.slug,
                avatar: data.avatar,
                isAnonymous: false
              };
              this.localStorageService.set('user', user);
              this.localStorageService.set('csrf_token', resp.csrf_token);
              this.userService.emitUser(user);
              this.loading = false;
              this.router.navigate(['home']).then();
              this.loaderService.hide();
            },
            (error) => {
              console.log(error);
              this.loading = false;
              this.accountDisabled = true;
              this.loaderService.hide();
            });
        } else {
          this.loading = false;
          this.loaderService.hide();
          this.insufficientGrantedScope = true;
        }
      }
    );
  }

}
