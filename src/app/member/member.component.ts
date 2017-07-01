import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../app.service';
import { MainService } from '../services/main.service';
import { LoaderService } from '../shared/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';

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
  public sub: any;
  public slugName: any;

  constructor(private route: ActivatedRoute,
              public fb: FormBuilder,
              public loaderService: LoaderService,
              private appState: AppState,
              private localStorageService: LocalStorageService,
              private router: Router,
              private mainService: MainService) {
    this.loaderService.show();
    this.userInfo = this.appState.state.userInfo;
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
    this.mainService.setUserProfile(userSetting).then((resp) => {
      if (resp.status) {
        this.alertType = 'success';
        this.msgContent = 'Updated user information successful.';
        this.userInfo.receiveEmail = userSetting.field_notify_email;
        this.appState.set('userInfo', this.userInfo);
      } else {
        this.alertType = 'danger';
        this.msgContent = 'Updated user information failed.';
        this.settingForm.patchValue({
          receiveEmail: parseInt(this.userInfo.receiveEmail, 2)
        });
      }
    });
    this.userInfo.showNav = true;
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      let currentSlug = this.localStorageService.get('slug');
      if (!currentSlug || this.slugName !== currentSlug) {
        this.router.navigate(['/' + this.slugName], {skipLocationChange: true}).then();
      }
      this.getUserProfile(this.slugName);
    });
  }

  private getUserProfile(slugName: string): void {

    this.mainService.getUserProfile(slugName).then((response) => {
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
      this.loaderService.hide();
    });
  }

}
