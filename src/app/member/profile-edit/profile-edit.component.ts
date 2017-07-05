import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../app.service';
import { CountryPickerService, ICountry } from 'angular2-countrypicker';
import { MainService } from '../../services/main.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../app.interface';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent implements OnInit {

  public user: User;
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
      this.requiredField,
      Validators.minLength(8),
      Validators.maxLength(30),
      Validators.pattern(/^[+]?([0-9][-]*){8,30}$/)
    ])],
    country: [''],
  });
  public alertType = 'danger';
  public msgContent: string;
  public sub: any;
  public slugName: any;
  public ready = false;

  constructor(public fb: FormBuilder,
              private appState: AppState,
              private localStorageService: LocalStorageService,
              private loaderService: LoaderService,
              private countryPickerService: CountryPickerService,
              private mainService: MainService,
              private router: Router,
              private route: ActivatedRoute,
              private profileService: ProfileService) {
  }

  public ngOnInit() {
    this.user = this.localStorageService.get('user') as User;
    this.countryPickerService.getCountries().subscribe(
      (countries) => {
        let defaultCountry = <ICountry> {
          cca3: 'null',
          name: {
            common: 'Country'
          }
        };
        this.countries = countries;
        this.countries.unshift(defaultCountry);
      }
    );
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      if (!this.user.slug || this.slugName !== this.user.slug) {
        this.router.navigate(['/' + this.slugName], {skipLocationChange: true}).then();
      }
      if (!this.user.isAnonymous) {
        this.loaderService.show();
        this.mainService.getUserProfile(this.slugName).subscribe(
          (user: User) => {
            this.profileForm.patchValue({
              firstName: user.firstName,
              lastName: user.lastName,
              contactNumber: user.contactNumber,
              country: '',
            });
            this.user = user;
          },
          (error) => {
            console.log(error);
          },
          () => {
            this.loaderService.hide();
            this.ready = true;
          }
        );
      }
    });
  }

  public onSubmit(): void {
    if (this.profileForm.valid) {
      let data = {
        field_first_name: this.profileForm.value.firstName,
        field_last_name: this.profileForm.value.lastName,
        email: this.user.email,
        field_contact_number: this.profileForm.value.contactNumber,
        field_country: this.profileForm.value.country,
        field_notify_email: this.user.email,
        follow: {
          following: this.user.followingNumber,
          follower: this.user.followerNumber,
        }
      };
      this.loaderService.show();
      this.mainService.setUserProfile(this.user, data).subscribe(
        (resp) => {
          this.user.firstName = data.field_first_name;
          this.user.lastName = data.field_last_name;
          this.user.name = this.user.firstName + ' ' + this.user.lastName;
          this.localStorageService.set('user', this.user);
          this.msgContent = resp.message;
          this.profileService.change(this.user);
          if (resp.status) {
            this.alertType = 'success';
          }
        },
        (error) => {
          console.log(error);
        },
        () => this.loaderService.hide()
      );
    }
  }

  public requiredField(control: FormControl) {
    if (control.value == null) {
      return {
        requiredField: false
      };
    }
    return control.value.toString().trim().length ? null : {
      requiredField: true
    };
  }

}
