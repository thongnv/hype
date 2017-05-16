import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class MainService {
  public constructor(private _localStorageService: LocalStorageService, private _http: Http) {
  }

  public getUserData() {

    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});

    return this._http.get(AppSetting.API_USER_PROFILE, options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public login(fbToken: string) {
    return new Promise((resolve, reject) => {

      let token = {fb_token: fbToken};
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers, withCredentials: true});

      this._http.post(AppSetting.API_LOGIN, JSON.stringify(token), options).subscribe(
        (response) => {
          console.log('login#success', response.json());
          this._localStorageService.set('csrf_token', response.json().csrf_token);
          this._localStorageService.set('logout_token', response.json().logout_token);
          this._localStorageService.set('user_name', response.json().current_user.name);
          this._localStorageService.set('uid', response.json().current_user.uid);

          resolve(response);
        },
        (err) => {
          console.debug(err);
          reject(err);
        }
      );
    });
  }

  public logout() {
    let logoutToken = this._localStorageService.get('logout_token');
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers, withCredentials: true});

    return new Promise((resolve, reject) => {
      this._http.get(AppSetting.API_LOGOUT + logoutToken, options).subscribe(
        (response) => {
          console.log('API_LOGOUT: ', response.json());
          this._localStorageService.clearAll();
          resolve(response);
        },
        (err) => {
          console.debug(err);
          reject(err);
        }
      );
    });
  }

  public getUserProfile() {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});

    return new Promise((resolve, reject) => {
      this._http.get(AppSetting.API_USER_PROFILE, options).subscribe(
        (response) => {
          resolve(response.json());
        },
        (err) => {
          console.debug(err);
          reject(err);
        }
      );
    });
  }

  public setUserProfile(userProfile: any) {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    console.log(userProfile);
    return new Promise((resolve, reject) => {
      this._http.post(AppSetting.API_USER_PROFILE, userProfile, options).subscribe(
        (response) => {
          console.log('GET USER PRO: ', response.json());
          resolve(response);
        },
        (err) => {
          console.debug(err);
          reject(err);
        }
      );
    });
  }

  public isLoggedIn(): any {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers, withCredentials: true});

    return new Promise((resolve, reject) => {
      this._http.get(AppSetting.API_LOGIN_STATUS, options).subscribe(
        (response) => {
          console.log('API_LOGIN_STATUS: ', response.json());
          resolve(response);
        },
        (err) => {
          console.debug(err);
          reject(err);
        }
      );
    });
  }

  private handleError(error: any): Promise<any> {
    console.error(error);
    return Promise.reject(error.message || error);
  }
}
