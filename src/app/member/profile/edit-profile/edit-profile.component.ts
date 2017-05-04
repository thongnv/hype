import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../app.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

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
