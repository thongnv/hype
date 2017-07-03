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

  constructor(private fb: FacebookService,
              private mainService: MainService,
              private localStorageService: LocalStorageService) {
  }

  public ngOnInit() {
    if (this.loggedIn) {
      window.location.href = '/home';
    } else {
      this.fb.init(this.initParams).then();
      this.ready = true;
    }
  }

  public onClickLogin() {
    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile,user_friends,email,pages_show_list'
    };
    this.fb.login(loginOptions).then(
      (loginRes: LoginResponse) => {
        this.mainService.login(loginRes.authResponse.accessToken).then(
          (resp) => {
            this.localStorageService.set('loginData', JSON.stringify(resp));
            this.localStorageService.set('csrf_token', resp.csrf_token);
            this.localStorageService.set('slug', resp.current_user.slug);
            window.location.reload();
          });
      })
      .catch(this.handleError);
  }

  private handleError(error) {
    console.error('Error processing action', error);
  }

}
