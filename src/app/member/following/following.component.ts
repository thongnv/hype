import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  public userInfo: any;
  public followings: any;
  constructor(
      private appState: AppState
  ) { }

  demo(): void{
    this.userInfo = this.appState.state.userInfo;
    this.followings = [
      {id: 1, name:'Friend 1', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 2, name:'Friend 2', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 3, name:'Friend 3', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 4, name:'Friend 4', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 5, name:'Friend 5', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 6, name:'Friend 6', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 7, name:'Friend 7', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 8, name:'Friend 8', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 9, name:'Friend 9', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 10, name:'Friend 10', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 11, name:'Friend 11', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 12, name:'Friend 12', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 13, name:'Friend 13', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 14, name:'Friend 14', avatar: "assets/img/avatar/demoavatar.png"},
      {id: 15, name:'Friend 15', avatar: "assets/img/avatar/demoavatar.png"},
    ];
  }
  ngOnInit() {
    this.demo();
  }

}
