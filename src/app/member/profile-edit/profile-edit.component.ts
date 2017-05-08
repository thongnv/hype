import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppState } from '../../app.service';
import { CountryPickerService } from 'angular2-countrypicker';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})


export class ProfileEditComponent implements OnInit {

  public userInfo: any;
  public countries: any[];


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
      private countryPickerService: CountryPickerService
  ) {
    this.countryPickerService.getCountries().subscribe(countries => {
      this.countries = countries;
      console.log("countries: ", countries[0])
    });

  }

  demo(): void{
    this.userInfo = this.appState.state.userInfo;
  }

  onSubmit(event): void{
    console.log(this.profileForm.value);

  }

  ngOnInit() {
    this.demo();
  }

}
