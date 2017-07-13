import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class BaseApiService {

  public constructor(private http: Http,
                     private localStorageService: LocalStorageService) {
  }

  public get(endpoint: any, params?: any) {
    let csrfToken = <string> this.localStorageService.get('csrf_token');
    let headers = new Headers();
    headers.append('X-CSRF-Token', csrfToken);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'q=0.8;application/json;q=0.9');
    let options = new RequestOptions({
      headers,
      withCredentials: true
    });
    if (params) {
      let p = new URLSearchParams();
      for (let k of params) {
        p.set(k, params[k]);
      }
      options.search = !options.search && p || options.search;
    }
    return this.http.get(endpoint, options);
  }

  public post(endpoint: any, body: any) {

    let csrfToken = <string> this.localStorageService.get('csrf_token');
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({
      headers,
      withCredentials: true
    });
    return this.http.post(endpoint, body, options);
  }

}
