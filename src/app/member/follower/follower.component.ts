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
  public followingPage: number = 0;
  public msgContent: string;
  public alertType: string;
  public constructor(private appState: AppState, private mainService: MainService) {
    this.userInfo = this.appState.state.userInfo;

    let followingPage = this.appState.state.followingPaging;
    if (followingPage !== undefined) {
      this.followingPage = followingPage;
    }
    this.appState.set('followingPage', this.followingPage);
    console.log('followingPage', this.followingPage);
  }

  public ngOnInit() {
    this.getUserProfile();
    this.getUserFollow('follower', this.followingPage);
  }
  public updateFollow(item: any) {
    console.log('item', item);
    if (item.stateFollow === 'yes') {
      this.userInfo.followingNumber--;
    } else {
      this.userInfo.followingNumber++;
    }
    this.alertType = 'success';
    this.msgContent = 'Update following successful';
  }
  private getUserFollow(followFlag: string, page: number): void {
    this.mainService.getUserFollow(followFlag, page).then((response) => {
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
      this.userInfo.showNav = false;
      this.appState.set('userInfo', this.userInfo);
      console.log('response: ', response);
    });
  }
}
