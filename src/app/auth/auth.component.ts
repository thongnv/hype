import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import { AppSetting } from '../app.setting'
import {AuthService} from "./auth.service";
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
      private fb: FacebookService,
      private authService: AuthService
  ) {

    let initParams: InitParams = AppSetting.FACEBOOK;

    fb.init(initParams);

  }

  loginWithFacebook(): void {

    this.fb.login()
        .then((response: LoginResponse) => console.log(response))
        .catch((error: any) => console.error(error));
  }

  ngOnInit() {

  }

}
