import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
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
    'X-CSRF-Token': <string> this._localStorageService.get('csrf_token')
  });

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
          console.log('_localStorageService ==> csrf_token: ',
            this._localStorageService.get('csrf_token'));
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
    return new Promise((resolve, reject) => {
      this._http.post(AppSetting.API_LOGOUT, JSON.stringify({}), options).subscribe(
        (response) => {
          console.log('API_LOGOUT: ', response);
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

  public getUserInterest(slugName?: string, page?: number): Promise<any> {
    let currentSlug = <string> this._localStorageService.get('slug');
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    slugName = slugName ? slugName : currentSlug;
    return this._http.get(AppSetting.API_USER_INTEREST + slugName + '?_format=json', options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public updateUserInterests(slugName?: string, item?: any[]): Promise<any> {
    let currentSlug = <string> this._localStorageService.get('slug');
    slugName = slugName ? slugName : currentSlug;
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.post(AppSetting.API_USER_INTEREST +
      slugName + '?_format=json', JSON.stringify(item), options)
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
      AppSetting.API_ENDPOINT + 'api/v1/article/' + slugName + '?_format=json', options
    ).map((res) => {
      return res.json();
    })
      .catch((error: any) => {
        return Observable.throw(new Error(error.json()));
      });
  }

  public getCategoryArticle(): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get(AppSetting.API_CATEGORIES_ARTICLE, options)
      .map((res) => {
        return res.json();
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error.json()));
      });
  }

  public getCurate(filter, cate): Observable<Response> {
    let headers = this.defaultHeaders;
    let myParams = new URLSearchParams();
    myParams.set('_format', 'json');
    if (filter === 'latest') {
      myParams.set('filter', 'latest');
    }
    if (parseInt(cate, 10)) {
      myParams.set('cate', cate);
    }

    let options = new RequestOptions({
      headers,
      params: myParams,
      withCredentials: true
    });

    return this._http.get(AppSetting.API_ARTICLE, options)
      .map((res) => {
        return res.json();
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error.json()));
      });
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
    return this._http.get(AppSetting.API_NOTIFICATION +
      '&limit=' + AppSetting.PAGE_SIZE + '&page=' + page, options)
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
      '&page=' + page + '&slug=/user/' + (slugName ? slugName : currentSlug), options)
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
      '&page=' + page + '&slug=/user/' + (slugName ? slugName : currentSlug), options)
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
      '&limit=' + AppSetting.PAGE_SIZE + '&page=' + page +
      '&slug=' + (slugName ? slugName : currentSlug), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public isLoggedin(): boolean {
    return !!this._localStorageService.get('csrf_token');
  }

  public removeFavoritedEventList(slug: string): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});

    return this._http.post(AppSetting.API_UNFAVORITE_EVENT_LIST + slug, JSON.stringify({}), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public favoritePlace(idsNo: string): Promise<any> {
    let csrfToken = <string> this._localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});

    return this._http.post(AppSetting.API_FAVORITE_PLACE, JSON.stringify({ids_no: idsNo}), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  public getInstagramImage(src: string): Promise<any> {
    let headers = new Headers({'Content-Type': 'application/json', 'crossDomain': true});
    let options = new RequestOptions({headers, withCredentials: true});
    return this._http.get('https://www.instagram.com/explore/tags/sciencecentresg/?__a=1', options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    // console.error(error);
    return Promise.reject(error.message || error);
  }
}
