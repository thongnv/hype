import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { userInfo } from 'os';

@Component({
    selector: 'app-following',
    templateUrl: './following.component.html',
    styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

    public userInfo: any;

    constructor(private appState: AppState,
                private mainService: MainService) {
    }

    public demo(): void {
        this.userInfo = this.appState.state.userInfo;
    }

    public ngOnInit() {
        this.demo();
        this.getUserFollow('following');
    }

    private getUserFollow(followFlag: string): void {
        this.mainService.getUserFollow(followFlag).then((response) => {
            this.userInfo.following = response;
            console.log('response', response);
            this.appState.set('userInfo', this.userInfo);
        });
    }

}
