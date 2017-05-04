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
  templateUrl : 'app.component.html'
})

export class AppComponent implements OnInit {

    public userName: string;
    public userAvatar: string;
    public userSlugName: string;
    public userFollowing: number;
    public userFollower: number;

    public userInfo: any;

    public sampleTemplate = `
<fa [name]="rocket" [border]=true></fa>
<i fa [name]="rocket" [border]=true></i>
`

  constructor(
    public appState: AppState
  ) {}
    public mapOptions: any[];
    public selectedMapOption: any;

    public onSelectMapOption(option: any): void{
        this.selectedMapOption = option;
    }
    demo(): void{

        this.userName = "Dinh Quyet";
        this.userSlugName = "dinhquyet";
        this.userAvatar = "assets/img/avatar/demoavatar.png";
        this.userFollowing = 123;
        this.userFollower = 456;

        this.userInfo={
            userName: this.userName,
            userSlugName: this.userSlugName,
            userAvatar: this.userAvatar,
            userFollowing: this.userFollowing,
            userFollower: this.userFollower,
            showNav: true,
        };
        this.appState.set('userInfo', this.userInfo);
    }
  public ngOnInit() {

      this.mapOptions=[
          {id: 1, name: 'singapore'},
          {id: 2, name: 'neighbourhood'},
          {id: 3, name: 'option 2'},
          {id: 4, name: 'option 3'}
      ];

      this.selectedMapOption = this.mapOptions[0];
      this.demo();

      console.log('Initial App State', this.appState.state);
  }
}
