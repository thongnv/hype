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

  public getArticle(slugName): Observable<Response> {
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

  public getCurate(filter, cate, page, limit): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/article' +
      '?_format=json' +
      '&filter=' + filter +
      '&limit=' + limit +
      '&page=' + page +
      '&cate=' + cate,
      options
    )
      .map((res) => {
        return res.json();
      })
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public getCurateTrending(): Observable<any> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(AppSetting.API_ENDPOINT + 'api/v1/toparticle?_format=json', options)
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

  public getNotifications(page: number): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let myParams = new URLSearchParams();
    myParams.set('_format', 'json');
    myParams.set('limit', AppSetting.PAGE_SIZE.toString());
    myParams.set('page', page ? page.toString() : '0');
    let options = new RequestOptions({headers, withCredentials: true, params: myParams});
    return this.http.get(AppSetting.API_ENDPOINT + 'api/v1/notify?_format=json', options)
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }

  public updateNotifications(type: string, mid?: string): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(AppSetting.API_ENDPOINT + 'api/v1/notify?_format=json',
      JSON.stringify({type, mid}), options
    )
      .map((resp) => resp.json())
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

}
