import { TokenService } from 'angular2-auth';
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import { AppSetting } from '../app.setting'

@Injectable()
export class AuthService {

    constructor(
        private _http: Http,
        private _tokenService: TokenService
    ) {}

    login(email: string, password: string) {
        this._http.post(AppSetting.API_ENDPOINT, { email: email, password: password }).subscribe(
            response => {
                this._tokenService.setToken(response.json().token);
            },
            error => console.error(error),
            () => console.log('login#done')
        );
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
}