import { Injectable } from '@angular/core';
import { BaseApiService } from './service_base.service';
import { AppSetting } from '../app.setting';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
// import { map } from 'rxjs/operator/map';
// import { $SQ } from 'codelyzer/angular/styles/chars';

@Injectable()

export class HomeService {

  constructor(private api: BaseApiService) {
    console.log('home api');
  }

  public getEvents(params: any) {
    let seq = this.api.get(AppSetting.API_TRENDING, params).share();
    seq.map((res) => res.json())
      .subscribe((res) => {
        //
      }, (err) => {
        console.log('err', err);
      });
    return seq;
  }

  public getLatestEvents(params: any) {
    return this.api.get(AppSetting.API_TRENDING, params)
      .share()
      .map(resp => resp.json());

  }

  public getTop100(params: any) {
    let seq = this.api.get(AppSetting.API_ENDPOINT_TOP, params).share();
    seq.map((res) => res.json())
      .subscribe((res) => {
        //
      }, (err) => {
        console.log('err', err);
      });
    return seq;
  }

  public getCategories(type: any) {
    let seq = this.api.get(AppSetting.API_CATEGORIES_EVENT).share();
    seq.map((res) => res.json())
      .subscribe((res) => {
        //
      }, (err) => {
        //
      });
    return seq;
  }

  public likeEvent(body: any) {

    let seq = this.api.post(AppSetting.API_ENDPOINT_LIKE + '&slug=' + body.slug, body).share();
    seq.map((res) => res.json())
      .subscribe((res) => {
        //
      }, (err) => {
        //
      });
    return seq;
  }
}
