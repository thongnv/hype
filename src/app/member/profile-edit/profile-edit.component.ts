import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../../app.service';
import { CountryPickerService, ICountry } from 'angular2-countrypicker';
import { MainService } from '../../services/main.service';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent implements OnInit {

  public userInfo: any;
  public countries: any[];
  public profileForm = this.fb.group({
    firstName: ['', Validators.compose([
      this.requiredField,
      Validators.maxLength(30)
      ])],
    lastName: ['', Validators.compose([
      Validators.maxLength(30)
    ])],
    contactNumber: ['', Validators.compose([
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(30),
      Validators.pattern(/^[+]?([0-9][-]*){10,30}$/)
    ])],
    country: [''],
  });
  public alertType: string;
  public msgContent: string;
  public sub: any;
  public slugName: any;

  constructor(public fb: FormBuilder,
              private appState: AppState,
              private countryPickerService: CountryPickerService,
              private mainService: MainService, private route: ActivatedRoute,
              private _localStorageService: LocalStorageService) {
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

    this.userInfo = this.appState.state.userInfo;
    this.userInfo.showNav = true;
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      console.log('USER: ', this.slugName);
      this.getUserProfile(this.slugName);
    });
  }

  public onSubmit(): void {
    if (this.profileForm.valid) {
      let userProfile = {
        field_first_name: this.profileForm.value.firstName,
        field_last_name: this.profileForm.value.lastName,
        email: this.userInfo.email,
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
            this.msgContent = resp.message;
            this.userInfo.firstName = userProfile.field_first_name;
            this.userInfo.lastName = userProfile.field_last_name;
            this.appState.set('userInfo', this.userInfo);
          } else {
            this.alertType = 'danger';
            this.msgContent = resp.message;
          }

        }
      );
    }
  }
  public requiredField(control: FormControl) {
    console.log(control.value);
    return control.value.toString().trim().length ? {requiredField: false} : {
      requiredField: true
    };
  }
  private getUserProfile(slugName: string): void {
    this.mainService.getUserProfile(slugName).then((response) => {
      this.profileForm.patchValue({
        firstName: response.field_first_name,
        lastName: response.field_last_name,
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
