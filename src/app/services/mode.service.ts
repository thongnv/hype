import { Injectable } from '@angular/core';
import { BaseApiService } from "./service_base.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {objectify} from "tslint/lib/utils";

@Injectable()

export class ModeService {

  public constructor(private api: BaseApiService) {
    console.log('category service');
  }

  public getCategories(params) {
      let seq = this.api.get('http://hylo.dev/assets/mock-data/terms.json').share();
      switch (params){
        case 'eat':
             seq = this.api.get('http://hylo.dev/assets/mock-data/term_eat.json').share();
            break;
        case 'play':
             seq = this.api.get('http://hylo.dev/assets/mock-data/term_play.json').share();
            break;
    }
      seq
          .map(res => res.json())
          .subscribe(res => {
          }, err => {
              console.error('ERROR', err);
          });
      return seq;
  }

  public getModes(params: any) {

    let seq = this.api.get('http://hylo.dev/assets/mock-data/events.json').share();
    seq
      .map(res => res.json())
      .subscribe(res => {

      }, err => {
        console.log(err);
      });
    return seq;
  }

  public getFilterMode() {
    let seq = this.api.get('http://hylo.dev/assets/mock-data/cuisine.json').share();
    seq
      .map(res => res.json())
      .subscribe(res => {

      }, err => {
        console.log(err);
      });

    return seq;
  }
}