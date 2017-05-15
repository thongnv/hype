import {
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

    public userInfo: any;

    constructor(
        public appState: AppState
    ) {

    }

    public mapOptions: any[];

    public selectedMapOption: any;

    public onSelectMapOption(option: any): void {
        this.selectedMapOption = option;
    }

    demo(): void {

        this.userInfo = {
            userName: "Dinh Quyet",
            userSlugName: "dinhquyet",
            userAvatar: "assets/img/avatar/demoavatar.png",
            userFollowing: [
                {id: 1, name: 'Friend 1', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 2, name: 'Friend 2', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 3, name: 'Friend 3', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 4, name: 'Friend 4', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 5, name: 'Friend 5', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 6, name: 'Friend 6', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 7, name: 'Friend 7', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 8, name: 'Friend 8', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 9, name: 'Friend 9', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 10, name: 'Friend 10', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 11, name: 'Friend 11', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 12, name: 'Friend 12', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 13, name: 'Friend 13', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 14, name: 'Friend 14', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 15, name: 'Friend 15', avatar: "assets/img/avatar/demoavatar.png"},
            ],
            userFollower: [
                {id: 1, name: 'Friend followers 1', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 2, name: 'Friend followers 2', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 3, name: 'Friend followers 3', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 4, name: 'Friend followers 4', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 5, name: 'Friend followers 5', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 6, name: 'Friend followers 6', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 7, name: 'Friend followers 7', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 8, name: 'Friend followers 8', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 9, name: 'Friend followers 9', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 10, name: 'Friend followers 10', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 11, name: 'Friend followers 11', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 12, name: 'Friend followers 12', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 13, name: 'Friend followers 13', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 14, name: 'Friend followers 14', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 15, name: 'Friend followers 15', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 16, name: 'Friend followers 16', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 17, name: 'Friend followers 17', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 18, name: 'Friend followers 18', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 19, name: 'Friend followers 19', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 20, name: 'Friend followers 20', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 21, name: 'Friend followers 21', avatar: "assets/img/avatar/demoavatar.png"},
                {id: 22, name: 'Friend followers 22', avatar: "assets/img/avatar/demoavatar.png"},
            ],
            showNav: true,
        };
        this.appState.set('userInfo', this.userInfo);

        this.mapOptions = [
            {id: 1, name: 'singapore'},
            {id: 2, name: 'neighbourhood'},
            {id: 3, name: 'option 2'},
            {id: 4, name: 'option 3'}
        ];
        this.selectedMapOption = this.mapOptions[0];
    }

    public ngOnInit() {


        this.demo();

        console.log('Initial App State', this.appState.state);
    }
}
