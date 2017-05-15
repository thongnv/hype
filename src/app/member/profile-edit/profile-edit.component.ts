import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppState } from '../../app.service';
import { CountryPickerService } from 'angular2-countrypicker';
import { MainService } from '../../services/main.service';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})


export class ProfileEditComponent implements OnInit {

  public userInfo: any;
  public countries: any[];

  private userProfile: any;

  public profileForm = this.fb.group({
    firstName:  ["", Validators.required],
    lastName:  ["", Validators.required],
    emailAddress:  ["", Validators.email],
    contactNumber:  ["", Validators.required],
    country:  ["", Validators.required],
  });




  constructor(
      public fb: FormBuilder,
      private appState: AppState,
      private countryPickerService: CountryPickerService,
      private mainService: MainService
  ) {
    this.countryPickerService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  demo(): void{
    this.userInfo = this.appState.state.userInfo;
  }

  onSubmit(event): void{
    console.log(this.profileForm.value);
    this.mainService.setUserProfile(this.profileForm.value);
  }

  getUserProfile():void{
    this.userProfile = this.mainService.getUserProfile();
  }
  getLoginStatus():any{
    this.mainService.isLoggedIn();
  }
  ngOnInit() {
    this.demo();
    this.getLoginStatus();
    this.getUserProfile();
  }

}
