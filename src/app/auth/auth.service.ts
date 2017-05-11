import { TokenService } from 'angular2-auth';
import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import {AppConfig, APP_CONFIG} from "../app.config";

@Injectable()
export class AuthService {

    constructor(
        private _http: Http,
        private _tokenService: TokenService,
        @Inject(APP_CONFIG) config: AppConfig
    ) {
        console.log("config: ", config);
    }

    login(email: string, password: string) {
        this._http.post('/auth/login', { email: email, password: password }).subscribe(
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