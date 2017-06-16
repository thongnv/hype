import { Injectable } from '@angular/core';
import { BaseApiService } from "./service_base.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {objectify} from "tslint/lib/utils";
import {AppSetting} from "../app.setting";

@Injectable()

export class ModeService {

    public constructor(private api:BaseApiService) {
        console.log('category service');
    }

    public getCategories(params:any) {
        let seq = this.api.get(AppSetting.API_ENDPOINT_CAT_MODE, params).share();
        seq
            .map(res => res.json())
            .subscribe(res => {
            }, err => {
                console.error('ERROR', err);
            });
        return seq;
    }

    public getModes(params:any) {

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