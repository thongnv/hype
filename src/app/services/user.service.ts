import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BaseUser, User } from '../app.interface';

@Injectable()
export class UserService {
  private defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-Token': this.localStorageService.get('csrf_token')
  });

  public constructor(private localStorageService: LocalStorageService,
                     private http: Http) {
  }

  public getCsrfToken(): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(AppSetting.API_ENDPOINT + '/session/token', options)
      .catch((error: any) => {
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
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public logout(): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(
      AppSetting.API_ENDPOINT + 'api/user/logout?_format=json', options
    )
      .map((res: Response) => res.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getUserProfile(slugName?: string): Observable<User> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let user = this.localStorageService.get('user') as User;
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    let slug = slugName ? slugName : user.slug;
    return this.http.get(AppSetting.API_USER_PROFILE + slug + '?_format=json', options)
      .map((res) => {
        let data = res.json();
        return {
          avatar: data.field_image,
          name: data.field_first_name + ' ' + data.field_last_name,
          slug: slugName,
          isAnonymous: false,
          firstName: data.field_first_name,
          lastName: data.field_last_name,
          contactNumber: data.field_contact_number,
          followingNumber: data.follow.following,
          followerNumber: data.follow.follower,
          email: data.email,
          userFollowing: [],
          userFollower: [],
          showNav: true,
          acceptNotification: true
        };
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public setUserProfile(user: BaseUser, data: any): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(
      AppSetting.API_USER_PROFILE + user.slug + '?_format=json',
      JSON.stringify(data), options)
      .map((res) => res.json())
      .catch((error: any) => {
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
      .catch((error: any) => {
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
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public updateUserFollow(uid: number): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    let targetUser = {uid};
    return this.http.post(AppSetting.API_USER_UNFOLLOW, JSON.stringify(targetUser), options)
      .map((resp) => resp.json())
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getUserInterest(slugName?: string, page?: number): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});

    let myParams = new URLSearchParams();
    myParams.set('_format', 'json');

    let options = new RequestOptions({headers, withCredentials: true, params: myParams});
    slugName = slugName ? slugName : user.slug;
    return this.http.get(AppSetting.API_USER_INTEREST + slugName, options)
      .map((resp) => resp.json())
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public updateUserInterests(slugName?: string, item?: any[]): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    slugName = slugName ? slugName : user.slug;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(AppSetting.API_USER_INTEREST +
      slugName + '?_format=json', JSON.stringify(item), options)
      .map((resp) => resp.json())
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getUserEvent(slugName?: string, page?: number): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let myParams = new URLSearchParams();
    myParams.set('_format', 'json');
    if (slugName) {
      myParams.set('slug', '/user/' + slugName);
    } else {
      myParams.set('slug', '/user/' + user.slug);
    }
    if (page) {
      myParams.set('page', page.toString());
    } else {
      myParams.set('page', '0');
    }
    myParams.set('type', 'event');
    myParams.set('limit', AppSetting.PAGE_SIZE.toString());
    let options = new RequestOptions({headers, withCredentials: true, params: myParams});

    return this.http.get(AppSetting.API_FAVORITE_EVENT_LIST, options)
      .map((resp) => resp.json())
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getUserList(slugName?: string, page?: number): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    let csrfToken = this.localStorageService.get('csrf_token');
    let myParams = new URLSearchParams();
    myParams.set('_format', 'json');
    myParams.set('type', 'list');
    myParams.set('limit', AppSetting.PAGE_SIZE.toString());
    if (page) {
      myParams.set('page', page.toString());
    } else {
      myParams.set('page', '0');
    }
    if (slugName) {
      myParams.set('slug', '/user/' + slugName);
    } else {
      myParams.set('slug', '/user/' + user.slug);
    }

    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true, params: myParams});

    return this.http.get(AppSetting.API_FAVORITE_EVENT_LIST, options)
      .map((resp) => resp.json())
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getUserPlace(slugName?: string, page?: number): Observable<any> {
    let user = this.localStorageService.get('user') as User;
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let myParams = new URLSearchParams();
    myParams.set('_format', 'json');
    myParams.set('limit', AppSetting.PAGE_SIZE.toString());
    if (page) {
      myParams.set('page', page.toString());
    } else {
      myParams.set('page', '0');
    }
    if (slugName) {
      myParams.set('slug', slugName);
    } else {
      myParams.set('slug', user.slug);
    }
    let options = new RequestOptions({headers, withCredentials: true, params: myParams});

    return this.http.get(AppSetting.API_FAVORITE_PLACE, options)
      .map((resp) => resp.json())
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public removeFavoritedEventList(slug: string): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let myParams = new URLSearchParams();
    myParams.set('_format', 'json');
    if (slug) {
      myParams.set('slug', slug);
    } else {
      myParams.set('slug', slug);
    }
    let options = new RequestOptions({headers, withCredentials: true, params: myParams});

    return this.http.post(AppSetting.API_UNFAVORITE_EVENT_LIST, JSON.stringify({}), options)
      .map((resp) => resp.json())
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public checkLogin(): Observable<Response> {
    let headers = this.defaultHeaders;
    let myParams = new URLSearchParams();
    let options = new RequestOptions({
      headers,
      params: myParams,
      withCredentials: true
    });

    return this.http.get(AppSetting.API_LOGIN_STATUS, options)
      .map((res) => {
        return res.json();
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

}
