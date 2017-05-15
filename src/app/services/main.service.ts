import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";
import { AuthService } from '../services/auth.service';
import { AppSetting } from '../app.setting';
@Injectable()
export class MainService {

  private token: any;
  private headers: Headers = new Headers();

  constructor(
      private authService :AuthService,
      private _http: Http
  ) { }

  getUserProfile(){
    this.token = this.authService.getAccessToken();
    console.log("Token: ", this.token);
    let headers = new Headers({ 'Content-Type': 'application/json', "X-CSRF-Token": "RV73JpdD0gTtIRQg-uRNDgoTBs4wFg27UJIOnDAXbM0" }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject ) => {
      this._http.get(AppSetting.API_GET_PROFILE, options).
      subscribe(
          (response) => {
            console.log("USER PRO: ", response);
            resolve(response);
          },
          (err) => {
            console.debug(err);
            reject(err);
          }
      );
    });
  }

  setUserProfile():void{

  }
}
