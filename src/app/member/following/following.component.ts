import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  public userInfo: any;
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
