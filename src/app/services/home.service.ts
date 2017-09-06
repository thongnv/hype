import { Injectable } from '@angular/core';
import { AppSetting } from '../app.setting';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()

export class HomeService {

  private defaultHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-Token': this.localStorageService.get('csrf_token')
  });

  constructor(private localStorageService: LocalStorageService,
              private http: Http) {
  }

  public getLatestEvents(params): Observable<Response> {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({
      headers,
      withCredentials: true
    });
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/home/search' +
      '?page=' + params.page +
      '&limit=20' +
      '&start=' + params.start +
      '&tid=' + params.tid +
      '&time=' + params.time +
      '&latest=' + params.latest +
      '&when=' + params.when +
      '&lat=' + params.lat +
      '&long=' + params.long +
      '&radius=' + params.radius +
      '&price=' + params.price +
      '&weekend=' + params.weekend +
      '&order=' + params.order +
      '&type=' + params.type,
      options
    )
      .map(
        (res: Response) => res.json()
      )
      .catch(
        (error) => Observable.throw(new Error(error))
      );
  }

  public getTop100(params) {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({
      headers,
      withCredentials: true
    });
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/top' +
      '?_format=json' +
      '&page=' + params.page +
      '&limit=20' +
      '&start=' + params.start +
      '&tid=' + params.tid +
      '&time=' + params.time +
      '&latest=' + params.latest +
      '&when=' + params.when +
      '&lat=' + params.lat +
      '&long=' + params.long +
      '&radius=' + params.radius +
      '&price=' + params.price +
      '&weekend=' + params.weekend +
      '&order=' + params.order,
      options
    )
      .map(
        (res: Response) => res.json()
      )
      .catch(
        (error) => Observable.throw(new Error(error))
      );
  }

  public getCategories() {
    let headers = this.defaultHeaders;
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.get(
      AppSetting.API_ENDPOINT + 'api/v1/category/event/?_format=json', options
    )
      .map(
        (res: Response) => res.json()
      )
      .catch(
        (error) => Observable.throw(new Error(error))
      );
  }

  public likeEvent(body: any) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRF-Token': this.localStorageService.get('csrf_token')
    });
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(
      AppSetting.API_ENDPOINT + 'api/user/flag/bookmark?_format=json&slug=' + body.slug,
      body, options
    )
      .map((res: Response) => res.json())
      .catch(
        (error) => Observable.throw(new Error(error))
      );
  }
}
