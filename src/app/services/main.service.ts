import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MainService {
  private defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-Token': this.localStorageService.get('csrf_token')
  });

  public constructor(private localStorageService: LocalStorageService,
                     private http: Http) {
  }

  public getArticle(slugName): Observable<any> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/article/' + slugName + '?_format=json', options
    ).map((res) => {
      return res.json();
    })
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getCategoryArticle(): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/category/article/?_format=json', options
    )
      .map((res) => {
        return res.json();
      })
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public postArticle(data): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(
      AppSetting.API_ENDPOINT + 'api/v1/article?_format=json',
      data, options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public updateArticle(data): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.patch(
      AppSetting.API_ENDPOINT + 'api/v1/article?_format=json',
      data, options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getNotifications(user: number, page: number): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    // let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let headers = new Headers({'Content-Type': 'application/json'});
    // let options = new RequestOptions({headers, withCredentials: true});
    let options = new RequestOptions({headers});
    return this.http.get(
      AppSetting.NODE_SERVER + '/api/v1/notification/' + user + '/' + page
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public updateNotifications(uid: number, notificationId?: number): Observable<any> {
    // let csrfToken = this.localStorageService.get('csrf_token');
    // let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    // let options = new RequestOptions({headers, withCredentials: true});
    let uri = AppSetting.NODE_SERVER + '/api/v1/notification/' + uid;
    if (notificationId) {
      uri = AppSetting.NODE_SERVER + '/api/v1/notification/' + notificationId + '/' + uid;
    }
    return this.http.post(uri, '').map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public favoritePlace(idsNo: string): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(AppSetting.API_ENDPOINT + 'api/v1/favorite/place',
      JSON.stringify({ids_no: idsNo}), options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public search(keyword: string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/suggestion/' + keyword, options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public searchCompany(keyword: string): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers});
    return this.http.get(AppSetting.API_ENDPOINT + 'api/v1/company/suggestion/' + keyword, options)
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  // search result page
  public searchResult(keywords: string): Observable<any> {
    // request header
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers});

    return this.http.get(AppSetting.API_SEARCH_RESULT + keywords, options)
      .map(resp => resp.json())
      .catch(error => Observable.throw(new Error(error)));
  }

  public searchResultLoadMore(keywords: string, params: object): Observable<any> {
    // query params
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('type', params['type']);
    queryParams.set('page', params['page']);

    // request header
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers, params: queryParams});

    return this.http.get(AppSetting.API_SEARCH_RESULT_LOAD_MORE + keywords, options)
      .map(resp => resp.json())
      .catch(error => Observable.throw(new Error(error)));
  }
}
