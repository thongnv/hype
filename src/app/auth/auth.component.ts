import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { AppSetting } from '../app.setting';
import { MainService } from '../services/main.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  public ready = false;
  private loggedIn = this.localStorageService.get('loginData');
  private initParams: InitParams = AppSetting.FACEBOOK;

  constructor(private facebookService: FacebookService,
              private mainService: MainService,
              private localStorageService: LocalStorageService) {
  }

  public ngOnInit() {
    if (this.loggedIn) {
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
            this.localStorageService.set('loginData', JSON.stringify(resp));
            this.localStorageService.set('csrf_token', resp.csrf_token);
            this.localStorageService.set('slug', resp.current_user.slug);
            window.location.reload();
          },
          (error) => {
            console.log(error);
          });
      });
  }

}
