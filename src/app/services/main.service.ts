import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/toPromise';
import { AppState } from '../app.service';

@Injectable()
export class MainService {
  public constructor(private _localStorageService: LocalStorageService,
                     private _http: Http,
                     private _appState: AppState) {
  }

  public login(fbToken: string) {
    return new Promise((resolve, reject) => {

      let token = {fb_token: fbToken};
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers, withCredentials: true});

      this._http.post(AppSetting.API_LOGIN, JSON.stringify(token), options).subscribe(
        (response) => {
          this._localStorageService.set('csrf_token', response.json().csrf_token);
          this._localStorageService.set('logout_token', response.json().logout_token);
          this._localStorageService.set('user_name', response.json().current_user.name);
          this._localStorageService.set('uid', response.json().current_user.uid);
          this._localStorageService.set('slug', response.json().current_user.slug);
          this._localStorageService.set('field_first_name',
            response.json().current_user.field_first_name
          );
          this._localStorageService.set('field_last_name',
            response.json().current_user.field_last_name
          );
          console.log('_localStorageService: ', this._localStorageService.get('csrf_token'));
          resolve(response.json());
        },
        (err) => {
          console.debug(err);
          reject(err);
        }
      );
    });
  }

  public logout(): Promise<any> {
    let csrfToken = this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    console.log('csrfToken: ', csrfToken);
    console.log('options: ', options);
    return new Promise((resolve, reject) => {
      this._http.post(AppSetting.API_LOGOUT, options).subscribe(
        (response) => {
          console.log('API_LOGOUT: ', response);
          this._localStorageService.clearAll();
          this._appState.set('userInfor', null);
          resolve(response);
        },
        (err) => {
          console.debug(err);
          reject(err);
        }
      );
    });
  }

  public getUserProfile(slugName?: string): Promise<any> {

    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    console.log('options: ', options);
    return this._http.get(AppSetting.API_USER_PROFILE + slugName + '?_format=json', options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public setUserProfile(userProfile: any): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});

    return this._http.post(AppSetting.API_USER_PROFILE, JSON.stringify(userProfile), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
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

  public getUserFollow(followFlag: string): Promise<any> {
    const followUrl = (followFlag === 'following') ? AppSetting.API_USER_FOLLOWING :
      AppSetting.API_USER_FOLLOWER;
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(followUrl, options)
      .toPromise()
      .then((resp) => resp.json().result)
      .catch(this.handleError);
  }

  public updateUserFollow(uid: number): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    let targetUser = {uid};
    return this._http.post(AppSetting.API_USER_UNFOLLOW, JSON.stringify(targetUser), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public getUserInterest(): Promise<any> {

    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});

    return this._http.get(AppSetting.API_USER_INTEREST, options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public updateUserInterests(item: any): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.post(AppSetting.API_USER_INTEREST, JSON.stringify(item), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public getUserFavorite(type: string): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(AppSetting.API_USER_ACTIVITY, options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public getArticle(type: string): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(AppSetting.API_ARTICLE, options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public getUserPublicProfile(): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(AppSetting.API_ENDPOINT_DEMO, options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    // console.error(error);
    return Promise.reject(error.message || error);
  }
}
