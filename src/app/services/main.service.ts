import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BaseUser } from '../app.interface';

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
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getCategoryArticle(): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(AppSetting.API_CATEGORIES_ARTICLE, options)
      .map((res) => {
        return res.json();
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getCurate(filter, cate, page, limit): Observable<Response> {
    let headers = this.defaultHeaders;
    let myParams = new URLSearchParams();
    myParams.set('_format', 'json');
    myParams.set('filter', filter);
    if (limit) {
      myParams.set('limit', limit);
    }
    if (page) {
      myParams.set('page', page);
    }
    if (parseInt(cate, 10)) {
      myParams.set('cate', cate);
    }

    let options = new RequestOptions({
      headers,
      params: myParams,
      withCredentials: true
    });

    return this.http.get(AppSetting.API_ARTICLE, options)
      .map((res) => {
        return res.json();
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public getCurateTrending(tid) {
    let headers = this.defaultHeaders;
    let myParams = new URLSearchParams();
    myParams.set('_format', 'json');
    let options = new RequestOptions({
      headers,
      params: myParams,
      withCredentials: true
    });

    return this.http.get(AppSetting.API_CURATE_TRENDING, options)
      .map((res) => {
        return res.json();
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error));
      });
  }

  public postArticle(data) {
    let csrfToken = this.localStorageService.get('csrf_token');
    let myParams = new URLSearchParams();
    myParams.set('_format', 'json');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, params: myParams, withCredentials: true});
    return this.http.post(AppSetting.API_ARTICLE,
      data,
      options)
      .toPromise()
      .then(
        (resp) => resp.json()
      )
      .catch(handleError);
  }

  public getNotifications(page: number) {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let myParams = new URLSearchParams();
    myParams.set('_format', 'json');
    myParams.set('limit', AppSetting.PAGE_SIZE.toString());
    myParams.set('page', page ? page.toString() : '0');
    let options = new RequestOptions({headers, withCredentials: true, params: myParams});
    return this.http.get(AppSetting.API_NOTIFICATION, options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(handleError);
  }

  public updateNotifications(type: string, mid?: string) {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(AppSetting.API_NOTIFICATION, JSON.stringify({type, mid}), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(handleError);
  }

  public favoritePlace(idsNo: string): Promise<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});

    return this.http.post(AppSetting.API_FAVORITE_PLACE, JSON.stringify({ids_no: idsNo}), options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(handleError);
  }

  public search(keyword: string): Promise<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers});
    return this.http.get(AppSetting.API_SEARCH + keyword, options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(handleError);
  }

  public searchCompany(keyword: string): Promise<any> {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers});
    return this.http.get(AppSetting.API_COMPANY_SEARCH + keyword, options)
      .toPromise()
      .then((resp) => resp.json())
      .catch(handleError);
  }

}

function handleError(error: any): Promise<any> {
  return Promise.reject(error.message || error);
}
