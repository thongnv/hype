import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppState } from '../../app.service';
import { CountryPickerService } from 'angular2-countrypicker';
import { MainService } from '../../services/main.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent implements OnInit {

  public userInfo: any;
  public countries: any[];
  public userProfile: User;
  public profileForm = this.fb.group({
    firstName:  ['', Validators.required],
    lastName:  ['', Validators.required],
    email:  ['', Validators.email],
    contactNumber:  ['', Validators.required],
    country:  ['', Validators.required],
  });
  constructor(
    public fb: FormBuilder,
    private appState: AppState,
    private countryPickerService: CountryPickerService,
    private mainService: MainService
  ) {
    this.countryPickerService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }
  public ngOnInit() {
    this.demo();
    this.getLoginStatus();
    this.getUserProfile();
  }
  public onSubmit(): void {
    console.log(this.profileForm.value);
    // this.mainService.setUserProfile(this.profileForm.value);
  }
  private demo(): void {
    this.userInfo = this.appState.state.userInfo;
  }

  private getUserProfile(): void {
    this.mainService.getUserData().then((response) => {
      this.userProfile = response;
      console.log('userProfile: ', this.userProfile);
    });
  }

  private getLoginStatus(): any {
    this.mainService.isLoggedIn();
  }

}
