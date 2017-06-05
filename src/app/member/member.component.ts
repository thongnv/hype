import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../app.service';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  public userInfo: any;
  public settingForm = this.fb.group({
    receiveEmail: true
  });
  private sub: any;
  private slugName: any;

  constructor(private route: ActivatedRoute,
              public fb: FormBuilder,
              private appState: AppState,
              private mainService: MainService) {
  }

  public demo(): void {
    this.userInfo = this.appState.state.userInfo;
  }

  public onSubmit(event): void {
    let userSetting = {
      field_notify_email: (this.settingForm.value.receiveEmail) ? 1 : 0,
      field_first_name: this.userInfo.firstName,
      field_last_name: this.userInfo.lastName,
      email: this.userInfo.email,
      field_contact_number: this.userInfo.contactNumber,
      field_country: this.userInfo.country,
      follow: {
        following: this.userInfo.followingNumber,
        follower: this.userInfo.followerNumber,
      }
    };
    this.mainService.setUserProfile(userSetting).then((resp) => {
      console.log('updated setting: ', resp);
    });
  }

  public ngOnInit() {
    this.demo();
    this.getUserProfile();
    // this.sub = this.route.params.subscribe((params) => {
    //   this.slugName = params['id']; // (+) converts string 'id' to a number
    //   // In a real app: dispatch action to load the details here.
    //   console.log('USER: ', this.slugName);
    //   this.getUserProfile(this.slugName);
    // });
  }

  private getUserProfile(slugName?: string): void {

    this.mainService.getUserProfile(slugName).then((response) => {
    // this.mainService.getUserPublicProfile().then((response) => {
      this.settingForm.patchValue({
        receiveEmail: parseInt(response.profile.field_notify_email, 2)
      });
      this.userInfo.userName = response.profile.field_first_name +
        ' ' + response.profile.field_last_name;
      this.userInfo.firstName = response.profile.field_first_name;
      this.userInfo.lastName = response.profile.field_last_name;
      this.userInfo.userAvatar = response.profile.field_image;
      this.userInfo.email = response.profile.email;
      this.userInfo.country = response.profile.field_country;
      this.userInfo.followingNumber = response.profile.follow.following;
      this.userInfo.followerNumber = response.profile.follow.follower;
      this.userInfo.contactNumber = response.profile.field_contact_number;
      this.userInfo.receiveEmail = response.profile.field_notify_email;
      console.log('====> userProfile response: ', response);
    });
  }

}
