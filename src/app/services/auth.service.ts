import {TokenService, Token} from 'angular2-auth';
import { Injectable } from "@angular/core";
import {Http, Headers} from "@angular/http";
import { AppSetting } from "../app.setting";

@Injectable()
export class AuthService {

    private headers = new Headers();
    private loginData: any;
    constructor(
        private _http: Http,
        private _tokenService: TokenService
    ) {
        // this.demo();
    }

    login(fb_token: string) {
        return new Promise((resolve, reject ) => {

        let token = {fb_token: fb_token};

        this._http.post(AppSetting.API_LOGIN, JSON.stringify(token), {headers: this.headers}).
            subscribe(
            (response) => {
                this._tokenService.setToken(response.json());
                console.log('login#success',response);
                resolve(response);
            },
            (err) => {
                console.debug(err);
                reject(err);
            }
            );
        });
    }

    logout() {
        this._tokenService.removeToken();
    }

    loggedIn() {
        let token = this._tokenService.getToken();

        if(token && token.token) {
            return !token.isExpired();
        }
        return false;
    }

    getAccessToken(): string{
        let token = <any>this._tokenService.getToken();
        console.log("===>", token);
        return token.csrf_token;
    }

    getLogoutToken(): string{
        let token = <any>this._tokenService.getToken();
        return token.logout_token;
    }

    demo():void{
        this.loginData= {
            "current_user": {
                "uid": "6",
                "name": "test123"
            },
            "csrf_token": "RV73JpdD0gTtIRQg-uRNDgoTBs4wFg27UJIOnDAXbM0",
            "logout_token": "Xs-n03WnE78yBQ4gkMgWIwOlpN22OB1G-MHKUtcqlug"
        }
    }
}