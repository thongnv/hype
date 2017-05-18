import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';

@Component({
    selector: 'app-interest',
    templateUrl: './interest.component.html',
    styleUrls: ['./interest.component.css']
})

export class InterestComponent implements OnInit {

    public userInfo: any;
    public interests: any;
    public backupInterests: any;

    constructor(private appState: AppState, private mainService: MainService) {
    }

    public demo(): void {
        this.userInfo = this.appState.state.userInfo;
        // this.interests = [
        // {id: 1, name: 'interest 1'},
        // {id: 2, name: 'interest 2'},
        // {id: 3, name: 'interest 3'},
        // {id: 4, name: 'interest 4'},
        // {id: 5, name: 'interest 5'},
        // {id: 6, name: 'interest 6'},
        // {id: 7, name: 'interest 7'},
        // {id: 8, name: 'interest 8'},
        // {id: 9, name: 'interest 9'},
        // {id: 10, name: 'interest 10'},
        // {id: 11, name: 'interest 11'},
        // {id: 12, name: 'interest 12'},
        // {id: 13, name: 'interest 13'},
        // {id: 14, name: 'interest 14'},
        // {id: 15, name: 'interest 15'}
        // ];
    }

    public onSubmit() {
        console.log('update: ', this.interests);
        this.mainService.updateUserInterests(this.interests).then((resp) => {
            if (resp.status === null) {
                console.log('update fail: ');
                this.getInterests();
            }
        });
    }
    public getInterests(): void {
        this.mainService.getUserInterest().then((response) => {
            this.interests = response;
            this.backupInterests = Object.assign(response);
            console.log('response: ', response);
        });
    }
    public ngOnInit() {
        this.demo();
        this.getInterests();
    }

}
