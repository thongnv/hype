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

  public loginWithOptions() {

    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile,user_friends,email,pages_show_list'
    };

    this.fb.login(loginOptions)
      .then((res: LoginResponse) => {
        console.log('Login FB: ', res);
        this.mainService.login(res.authResponse.accessToken).then((resp: any) => {
          this.localStorageService.set('loginData', JSON.stringify(resp));
          console.log('Login response: ', resp);
          window.location.reload();
        });
      })
      .catch(console.error('Error processing action', error));
  }

}
