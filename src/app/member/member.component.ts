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

  public userInfo: any = {};
  public settingForm = this.fb.group({
    receiveEmail: true
  });

  public alertType: string;
  public msgContent: string;
  // private sub: any;
  // private slugName: any;


  constructor(private route: ActivatedRoute,
              public fb: FormBuilder,
              private appState: AppState,
              private mainService: MainService) {
    this.userInfo.showNav = true;
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
    console.log('sending setting data: ', userSetting);
    this.mainService.setUserProfile(userSetting).then((resp) => {
      console.log('updated setting: ', resp);
      if (resp.status) {
        this.alertType = 'success';
        this.msgContent = 'Updated user information successful.';
      } else {
        this.alertType = 'danger';
        this.msgContent = 'Updated user information failed.';
        this.settingForm.patchValue({
          receiveEmail: parseInt(this.userInfo.receiveEmail, 2)
        });
      }
    });
  }

  public ngOnInit() {
    // this.demo();
    this.getUserProfile();
    // this.sub = this.route.params.subscribe((params) => {
    //   this.slugName = params['id']; // (+) converts string 'id' to a number
    //   // In a real app: dispatch action to load the details here.
    //   console.log('USER: ', this.slugName);
    //   this.getUserProfile(this.slugName);
    // });
  }

  private getUserProfile(): void {

    this.mainService.getUserProfile(null).then((response) => {
      // this.mainService.getUserPublicProfile().then((response) => {
      this.settingForm.patchValue({
        receiveEmail: parseInt(response.field_notify_email, 2)
      });
      this.userInfo.userName = response.field_first_name +
        ' ' + response.field_last_name;
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
      console.log('====> userProfile response: ', response);
    });
  }

}
