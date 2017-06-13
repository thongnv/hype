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
  public interests: any[] = [];
  public pageNumber: number = 0;

  constructor(private appState: AppState, private mainService: MainService) {
    this.userInfo = this.appState.state.userInfo;
    this.userInfo.showNav = true;
  }

  public onSubmit() {
    console.log('sending update: ', this.interests);
    this.mainService.updateUserInterests(null, this.interests).then((resp) => {
      console.log('update: ', resp);
      if (resp.status === null) {
        console.log('update fail: ');
        this.getInterests(this.pageNumber);
      }else {
        console.log('update success: ');
      }
    });
  }

  public getInterests(page: number): void {
    this.mainService.getUserInterest(null, page).then((response) => {
      if (response.length > 0) {
        // this.pageNumber++;
        response.forEach((item) => {
          this.interests.push(item);
        });
      }
      console.log('response: ', response);
    });
  }

  public ngOnInit() {
    this.getInterests(this.pageNumber);
    this.getUserProfile();
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
      this.userInfo.showNav = true;
      this.appState.set('userInfo', this.userInfo);
      console.log('response: ', response);
    });
  }
}
