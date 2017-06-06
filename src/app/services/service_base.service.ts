import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
@Injectable()

export class BaseApiService {

    public constructor(private http: Http) {
        console.log('base api');
    }

    public get(endpoint:any, params?:any) {
        let headers = new Headers();;
        headers.append('X-CSRF-Token', '');
        let options = new RequestOptions({
            headers: headers
        });
        if (params) {
            let p = new URLSearchParams();
            for (let k in params) {
                p.set(k, params[k]);
            }
            options.search = !options.search && p || options.search;
        }
        return this.http.get(endpoint);
    }

    public post(endpoint:any, body:any, options:RequestOptions) {

    }

    public put(endpoint:any, body:any, options:RequestOptions) {

    }

    public delete(endpoint:any, body:any, options:RequestOptions) {

    }

}
