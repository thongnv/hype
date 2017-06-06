import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppState } from '../../app.service';
import { CountryPickerService, ICountry } from 'angular2-countrypicker';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent implements OnInit {

  public userInfo: any;
  public countries: any[];
  public profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    email: ['', Validators.email],
    contactNumber: ['', Validators.pattern('([0-9]{11})')],
    country: [''],
  });
  public alertType: string;
  public msgContent: string;
  constructor(public fb: FormBuilder,
              private appState: AppState,
              private countryPickerService: CountryPickerService,
              private mainService: MainService) {
    this.countryPickerService.getCountries().subscribe((countries) => {

      let defaultCountry = <ICountry> {
        cca3: 'null',
        name: {
          common: 'Country'
        }
      };
      this.countries = countries;
      this.countries.unshift(defaultCountry);
    });
  }

  public ngOnInit() {
    this.initUserData();
    this.getUserProfile();
  }

  public onSubmit(): void {
    console.log(this.profileForm.valid);
    console.log(this.profileForm.value);
    if (this.profileForm.valid) {
      let userProfile = {
        field_first_name: this.profileForm.value.firstName,
        field_last_name: this.profileForm.value.lastName,
        email: this.profileForm.value.email,
        field_contact_number: this.profileForm.value.contactNumber,
        field_country: this.profileForm.value.country,
        field_notify_email: this.userInfo.receiveEmail,
        follow: {
          following: this.userInfo.followingNumber,
          follower: this.userInfo.followerNumber,
        }
      };
      console.log('sending data: ', userProfile);
      this.mainService.setUserProfile(userProfile).then(
        (resp) => {
          if (resp.status) {
            this.alertType = 'success';
            this.msgContent = 'Updated user information successful.';
            this.userInfo.userName = userProfile.field_first_name + ' ' +
              userProfile.field_last_name;
            this.appState.set('userInfo', this.userInfo);
          } else {
            this.alertType = 'danger';
            this.msgContent = 'Updated user information failed.';
          }

        }
      );
    }
  }

  private initUserData(): void {
    this.userInfo = this.appState.state.userInfo;
  }

  private getUserProfile(): void {
    this.mainService.getUserProfile().then((response) => {
      this.profileForm.patchValue({
        firstName: response.field_first_name,
        lastName: response.field_last_name,
        email: response.email,
        contactNumber: response.field_contact_number,
        country: response.field_country,
      });
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
