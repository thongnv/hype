import { Injectable } from '@angular/core';
import { BaseApiService } from "./service_base.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { objectify } from "tslint/lib/utils";
import { AppSetting } from "../app.setting";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';

@Injectable()
export class ModeService {

  private LOCAL_HOST: any = '';

  public constructor(private api: BaseApiService,
                     private localStorageService: LocalStorageService,
                     private router: Router,
                     private http: Http) {
    this.LOCAL_HOST = window.location.origin;
  }

  public getCategories(params: any) {
    let seq = this.api.get(AppSetting.API_ENDPOINT_CAT_MODE, params).share();
    seq
      .map(res => res.json())
      .subscribe(res => {
      }, err => {
        console.error('ERROR', err);
      });
    return seq;
  }

  public getModes(params: any) {

    let seq = this.api.get(AppSetting.API_ENDPOINT_MODE, params).share();
    seq
      .map(res => res.json())
      .subscribe(res => {

      }, err => {
        console.log(err);
      });
    return seq;
  }

  public getFilterMode() {
    let seq = this.api.get(this.LOCAL_HOST + '/assets/mock-data/cuisine.json').share();
    seq
      .map(res => res.json())
      .subscribe(res => {

      }, err => {
        console.log(err);
      });

    return seq;
  }

  public favoritePlace(placeId: number): Observable<any> {
    let csrfToken = this.localStorageService.get('csrf_token');
    if (!this.localStorageService.get('user')) {
      this.router.navigate(['login']).then();
      return;
    }
    let headers = new Headers({'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken});
    let options = new RequestOptions({headers, withCredentials: true});
    return this.http.post(
      AppSetting.API_ENDPOINT + 'api/v1/favorite/place',
      JSON.stringify({ids_no: placeId}), options
    )
      .map((resp) => resp.json())
      .catch((error) => {
        return Observable.throw(new Error(error));
      });
  }
}
