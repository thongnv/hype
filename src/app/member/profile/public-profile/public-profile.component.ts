import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../app.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {

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
