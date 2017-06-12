import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/toPromise';
import { AppState } from '../app.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MainService {
  private defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-Token': <string> this._localStorageService.get('csrf_token')});

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
    let currentSlug = <string> this._localStorageService.get('slug');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    let slug = slugName ? slugName : currentSlug;
    console.log('options: ', options);
    return this._http.get(AppSetting.API_USER_PROFILE + slug + '?_format=json', options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public setUserProfile(userProfile: any): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let currentSlug = <string> this._localStorageService.get('slug');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.post(AppSetting.API_USER_PROFILE + currentSlug + '?_format=json',
      JSON.stringify(userProfile), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public getUserFollow(followFlag: string, page: number): Promise<any> {
    let currentSlug = <string> this._localStorageService.get('slug');
    const followUrl = (followFlag === 'following') ?
      AppSetting.API_USER_FOLLOWING + '&slug=/user/' + currentSlug + '&page = ' + page :
      AppSetting.API_USER_FOLLOWER + '&slug=/user/' + currentSlug + '&page = ' + page;
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

  public getArticle(slugName): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(
      AppSetting.API_ENDPOINT + 'api/v1/article/' + slugName + '?_format=json' , options
    ).map((res) => {
        return res.json();
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error.json()));
      });
  }

  public getCategoryArticle(): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(AppSetting.API_CATEGORIES_ARTICLE, options)
      .toPromise()
      .then(
        (resp) => resp.json()
      )
      .catch(this.handleError);
  }

  public postArticle(data) {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.post(AppSetting.API_ARTICLE,
      data,
      options)
      .toPromise()
      .then(
        (resp) => resp.json()
      )
      .catch(this.handleError);
  }

  public getUserPublicProfile(slugName?: string): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(AppSetting.API_ENDPOINT_DEMO, options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public getNotifications(page: number) {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(AppSetting.API_NOTIFICATION + '&limit=10&page=' + page, options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public updateNotifications(type: string, mid?: string) {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.post(AppSetting.API_NOTIFICATION, JSON.stringify({type, mid}), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public getUserEvent(slugName?: string, page?: number): Promise<any> {
    let currentSlug = <string> this._localStorageService.get('slug');
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});

    return this._http.get(AppSetting.API_FAVORITE_EVENT +
      '&page=' + page + '&slug=/user/' + (slugName !== '' ? slugName : currentSlug), options)
      .toPromise()
      .then((resp) => resp.json().data)
      .catch(this.handleError);
  }

  public getUserList(slugName?: string, page?: number): Promise<any> {
    let currentSlug = <string> this._localStorageService.get('slug');
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});

    return this._http.get(AppSetting.API_FAVORITE_LIST +
      '&page=' + page + '&slug=/user/' + (slugName !== '' ? slugName : currentSlug), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public getUserPlace(slugName?: string, page?: number): Promise<any> {
    let currentSlug = <string> this._localStorageService.get('slug');
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});

    return this._http.get(AppSetting.API_FAVORITE_PLACE +
      '&limit=10&page=' + page + '&slug=' + (slugName !== '' ? slugName : currentSlug), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    // console.error(error);
    return Promise.reject(error.message || error);
  }
}
