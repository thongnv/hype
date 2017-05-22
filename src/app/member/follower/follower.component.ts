import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-follower',
  templateUrl: './follower.component.html',
  styleUrls: ['./follower.component.css']
})

export class FollowerComponent implements OnInit {

  public userInfo: any;

  public constructor(private appState: AppState, private mainService: MainService) {
    this.userInfo = this.appState.state.userInfo;
  }

  public ngOnInit() {
    this.getUserProfile();
    this.getUserFollow('follower');
  }
  private getUserFollow(followFlag: string): void {
    this.mainService.getUserFollow(followFlag).then((response) => {
      this.userInfo.userFollower = response;
      console.log('response', response);
      this.appState.set('userInfo', this.userInfo);
    });
  }
  private getUserProfile(): void {
    this.mainService.getUserProfile().then((response) => {

      this.userInfo.userName = response.field_first_name + ' ' + response.field_last_name;
      this.userInfo.firstName = response.field_first_name;
      this.userInfo.lastName = response.field_last_name;
      this.userInfo.userAvatar = response.field_image;
      this.userInfo.email = response.email;
      this.userInfo.country = response.field_country;
      this.userInfo.followingNumber = response.follow.following;
      this.userInfo.followerNumber = response.follow.follower;
      this.userInfo.contactNumber = response.field_contact_number;
      this.userInfo.receiveEmail = response.field_notify_email;

      this.appState.set('userInfo', this.userInfo);
      console.log('response: ', response);
    });
  }
}
