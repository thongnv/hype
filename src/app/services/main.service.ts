import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { AppSetting } from '../app.setting';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/toPromise';
import { User } from "../models/user";

@Injectable()
export class MainService {

		private handleError(error: any): Promise<any> {
			console.error(error);
			return Promise.reject(error.message || error);
		}

    constructor(private _localStorageService: LocalStorageService, private _http: Http) {
    }

    login(fb_token: string) {
        // this._cookieService.removeAll();
        return new Promise((resolve, reject) => {

            let token = {fb_token: fb_token};
            let headers = new Headers({"Content-Type": "application/json"});
            let options = new RequestOptions({headers: headers, withCredentials: true});

            this._http.post(AppSetting.API_LOGIN, JSON.stringify(token), options).subscribe(
                (response) => {
                    console.log('login#success', response.json());
                    this._localStorageService.set("csrf_token", response.json().csrf_token);
                    this._localStorageService.set("logout_token", response.json().logout_token);
                    this._localStorageService.set("user_name", response.json().current_user.name);
                    this._localStorageService.set("uid", response.json().current_user.uid);

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
        let logout_token = this._localStorageService.get("logout_token");
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers, withCredentials: true});

        return new Promise((resolve, reject) => {
            this._http.get(AppSetting.API_LOGOUT + logout_token, options).subscribe(
                (response) => {
                    console.log("API_LOGOUT: ", response.json());
                    this._localStorageService.clearAll();
                    resolve(response);
                },
                (err) => {
                    console.debug(err);
                    reject(err);
                }
            );
        });
    }

    getUserProfile() {
        let csrf_token = <string>this._localStorageService.get("csrf_token");
        let headers = new Headers({"Content-Type": "application/json", "X-CSRF-Token": csrf_token});
        let options = new RequestOptions({headers: headers, withCredentials: true});

        return new Promise((resolve, reject) => {
            this._http.get(AppSetting.API_USER_PROFILE, options).subscribe(
                (response) => {
                    resolve(response.json());
                },
                (err) => {
                    console.debug(err);
                    reject(err);
                }
            );
        });
    }
		getUserData() {

			let csrf_token = <string>this._localStorageService.get("csrf_token");
			let headers = new Headers({"Content-Type": "application/json", "X-CSRF-Token": csrf_token});
			let options = new RequestOptions({headers: headers, withCredentials: true});

			return this._http.get(AppSetting.API_USER_PROFILE, options)
				.toPromise()
				.then(resp => resp.json())
				.catch(this.handleError);
		}

    setUserProfile(userProfile: any) {
        let csrf_token = <string>this._localStorageService.get("csrf_token");
        let headers = new Headers({"Content-Type": "application/json", "X-CSRF-Token": csrf_token});
        let options = new RequestOptions({headers: headers, withCredentials: true});
        console.log(userProfile);
        return new Promise((resolve, reject ) => {
            this._http.post(AppSetting.API_USER_PROFILE,userProfile,  options).
            subscribe(
                (response) => {
                    console.log("GET USER PRO: ", response.json());
                    resolve(response);
                },
                (err) => {
                    console.debug(err);
                    reject(err);
                }
            );
        });
    }

    isLoggedIn(): any {
        let csrf_token = <string>this._localStorageService.get("csrf_token");
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers, withCredentials: true});

        return new Promise((resolve, reject) => {
            this._http.get(AppSetting.API_LOGIN_STATUS, options).subscribe(
                (response) => {
                    console.log("API_LOGIN_STATUS: ", response.json());
                    resolve(response);
                },
                (err) => {
                    console.debug(err);
                    reject(err);
                }
            );
        });
    }
}
