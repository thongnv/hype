import { Injectable } from '@angular/core';
import { BaseApiService } from "./service_base.service";
import {AppSetting} from "../app.setting";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class HomeService {

    constructor(private api:BaseApiService) {
        console.log('home api');
    }

    getEvents(params:any) {
        let seq = this.api.get(AppSetting.API_TRENDING, params).share();
        seq.map(res=>res.json())
            .subscribe(res=> {

            }, err=> {
                console.log('err', err);
            });
        return seq;
    }
}