import { Component, OnInit } from '@angular/core';
import {FacebookService, InitParams, LoginResponse, LoginOptions} from 'ngx-facebook';
import { AppSetting } from '../app.setting'
import { MainService } from "../services/main.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  private loginData: any;
  constructor(
      private fb: FacebookService,
      private mainService: MainService,
      private router: Router
  ) {

    let initParams: InitParams = AppSetting.FACEBOOK;
    fb.init(initParams);

  }

  loginWithOptions() {

    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'public_profile,user_friends,email,pages_show_list'
    };

    this.fb.login(loginOptions)
        .then((res: LoginResponse) => {
          console.log('Logged in', res);
          this.mainService.login(res.authResponse.accessToken).then((respone)=>{
            this.router.navigate(['/member']);
          })
        })
        .catch(this.handleError);

  }

  private handleError(error) {
    console.error('Error processing action', error);
  }
  ngOnInit() {
  }

}