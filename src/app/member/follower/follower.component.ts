import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';


@Component({
  selector: 'app-follower',
  templateUrl: './follower.component.html',
  styleUrls: ['./follower.component.css']
})
export class FollowerComponent implements OnInit {

  public userInfo: any;
  public followings: any;
  constructor(
      private appState: AppState
  ) { }

  demo(): void{
    this.userInfo = this.appState.state.userInfo;
  }
  ngOnInit() {
    this.demo();
  }

}
