import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BaseUser, User } from '../app.interface';
import { Router } from '@angular/router';

@Injectable()
export class UserService {

  @Output() public userEmitter: EventEmitter<any> = new EventEmitter();

  private defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-Token': this.localStorageService.get('csrf_token')
  });

  public constructor(private localStorageService: LocalStorageService,
                     private router: Router,
                     private http: Http) {
  }

  public emitUser(user: User) {
    this.userEmitter.emit(user);
  }

  public getEmittedUser() {
    return this.userEmitter;
  }

  public getCsrfToken(): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(AppSetting.API_ENDPOINT + '/session/token', options)
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public login(fbToken: string): Observable<Response> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(
      AppSetting.API_LOGIN, JSON.stringify({fb_token: fbToken}), options
    )
      .map((res: any) => res.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public logout(): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'user/logout', options
    )
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getProfile(slugName?: string): Observable<User> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let user = this.localStorageService.get('user') as User;
    let slug = slugName ? slugName : user.slug;
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/profile/' + slug + '?_format=json', options
    )
      .map((res) => {
        let data = res.json();
        return {
          id: data.uid,
          avatar: data.field_image,
          name: data.field_first_name + ' ' + data.field_last_name,
          slug: slugName,
          isAnonymous: false,
          firstName: data.field_first_name,
          lastName: data.field_last_name,
          contactNumber: data.field_contact_number,
          country: data.field_country,
          followingNumber: data.follow.following,
          followerNumber: data.follow.follower,
          email: data.email,
          followings: [],
          followers: [],
          followed: data.user_follow,
          showNav: true,
          acceptNotification: data.field_notify_email === '1'
        };
      })
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public setProfile(user: BaseUser, data: any): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(
      AppSetting.API_ENDPOINT + 'api/v1/profile/' + user.slug + '?_format=json',
      JSON.stringify(data), options
    )
      .map((res) => res.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getFollowings(userSlug: string, page: number): Observable<any> {
    const url = AppSetting.API_ENDPOINT + 'api/user/flag/follow/list' +
      '?_format=hal_json' +
      '&limit=60' +
      '&type=following' +
      '&slug=/user/' + userSlug +
      '&page=' + page;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(url, options)
      .map((res) => res.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getFollowers(userSlug: string, page: number): Observable<any> {
    const url = AppSetting.API_ENDPOINT + 'api/user/flag/follow/list' +
      '?_format=hal_json' +
      '&limit=60' +
      '&type=follower' +
      '&slug=/user/' + userSlug +
      '&page=' + page;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(url, options)
      .map((res) => res.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public toggleFollow(userId: number): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    if (!this.localStorageService.get('user')) {
      this.router.navigate(['login']).then();
    }
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(
      AppSetting.API_ENDPOINT + 'api/user/flag/follow?_format=json',
      JSON.stringify({uid: userId}), options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getInterests(slugName?: string): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    slugName = slugName ? slugName : user.slug;
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/user/interest/' + slugName + '?_format=json', options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public updateInterests(slugName?: string, item?: any[]): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    slugName = slugName ? slugName : user.slug;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(
      AppSetting.API_ENDPOINT + 'api/v1/user/interest/' + slugName + '?_format=json',
      JSON.stringify(item), options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getFavouriteEvents(slugName?: string, page?: number): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    slugName = slugName ? slugName : user.slug;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/user/flag/bookmark/list' +
      '?_format=json' +
      '&slug=/user/' + slugName +
      '&page=' + page +
      '&type=event' +
      '&limit=10',
      options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getArticles(userSlug: string): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/article' +
      '?_format=json' +
      '&user=' + userSlug,
      options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getEvents(userSlug: string, page: number): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/event' +
      '?_format=json' +
      '&user=' + userSlug +
      '&page=' + page +
      '&limit=5',
      options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getFavouriteLists(slugName?: string, page?: number): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    slugName = slugName ? slugName : user.slug;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/user/flag/bookmark/list' +
      '?_format=json' +
      '&slug=/user/' + slugName +
      '&page=' + page +
      '&type=list' +
      '&limit=10',
      options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getFavoritePlaces(slugName?: string, page?: number): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    slugName = slugName ? slugName : user.slug;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/favorite/place' +
      '?_format=json' +
      '&slug=' + slugName +
      '&page=' + page +
      '&limit=10',
      options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public unFavoriteEventList(slug: string): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(
      AppSetting.API_ENDPOINT + 'api/user/flag/bookmark?_format=json&slug=' + slug,
      null, options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public checkLogin(): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(AppSetting.API_ENDPOINT + 'user/login_status?_format=json', options)
      .map((res) => res.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }
}
