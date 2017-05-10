import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private fb: FacebookService) {

    let initParams: InitParams = {
      appId: '1248837375215411',
      xfbml: true,
      version: 'v2.9'
    };

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
