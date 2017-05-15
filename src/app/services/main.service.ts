import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class MainService {

  constructor(
      private _localStorageService: LocalStorageService,
      private _http: Http
  ) { }

  login(fb_token: string) {
    return new Promise((resolve, reject ) => {

      let token = {fb_token: fb_token};
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
      this._http.post(AppSetting.API_LOGIN, JSON.stringify(token), {headers: headers}).
      subscribe(
          (response) => {
            console.log('login#success',response.json());
            this._localStorageService.set("csrf_token",response.json().csrf_token);
            this._localStorageService.set("logout_token",response.json().logout_token);
            this._localStorageService.set("user_name",response.json().current_user.name);
            this._localStorageService.set("uid",response.json().current_user.uid);
            resolve(response);
          },
          (err) => {
            console.debug(err);
            reject(err);
          }
      );
    });
  }

  logout(){
      let logout_token = this._localStorageService.get("logout_token");
      let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
      let options = new RequestOptions({ headers: headers });
  }

  getUserProfile(){
    let csrf_token = <string>this._localStorageService.get("csrf_token");
    let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json", "X-CSRF-Token": csrf_token});
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
