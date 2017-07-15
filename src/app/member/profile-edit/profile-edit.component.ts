import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryPickerService, ICountry } from 'angular2-countrypicker';
import { LoaderService } from '../../helper/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../app.interface';
import { UserService } from '../../services/user.service';

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
      requiredField,
      Validators.maxLength(30)
    ])],
    lastName: ['', Validators.compose([
      Validators.maxLength(30)
    ])],
    contactNumber: ['', Validators.compose([
      requiredField,
      Validators.minLength(8),
      Validators.maxLength(30),
      Validators.pattern(/^[+]?([0-9][-]*){8,30}$/)
    ])],
    country: [''],
  });
  public defaultCountry = <ICountry> {
    cca3: 'null',
    name: {
      common: 'Country',
      official: 'Country'
    }
  };
  public alertType = 'danger';
  public msgContent: string;
  public slugName: any;
  public ready = false;

  constructor(public fb: FormBuilder,
              private localStorageService: LocalStorageService,
              private loaderService: LoaderService,
              private countryPickerService: CountryPickerService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private profileService: ProfileService) {
  }

  public ngOnInit() {
    this.loaderService.show();
    this.user = this.localStorageService.get('user') as User;
    this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      if (!this.user || this.slugName !== this.user.slug) {
        this.router.navigate(['/' + this.slugName]).then();
        return;
      }
      this.countryPickerService.getCountries().subscribe(
        (countries) => {
          this.countries = countries;
          this.countries.unshift(this.defaultCountry);
        }
      );
      this.userService.getProfile(this.slugName).subscribe(
        (resp) => {
          this.user = resp;
          this.profileForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            contactNumber: this.user.contactNumber,
            country: this.user.country,
          });
          this.ready = true;
        },
        (error) => {
          console.log(error);
        },
        () => {
          this.loaderService.hide();
        }
      );
    });
  }

  public onSubmit(): void {
    this.msgContent = '';
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
      this.userService.setProfile(this.user, data).subscribe(
        (resp) => {
          this.user.firstName = data.field_first_name;
          this.user.lastName = data.field_last_name;
          this.user.name = data.field_first_name + ' ' + data.field_last_name;
          this.user.country = data.field_country;
          this.localStorageService.set('user', this.user);
          this.profileService.change(this.user);
          if (resp.status) {
            this.msgContent = 'Your profile has been successfully updated.';
            this.alertType = 'success';
          } else {
            this.msgContent = resp.message;
            this.alertType = 'danger';
          }
        },
        (error) => {
          console.log(error);
        },
        () => this.loaderService.hide()
      );
    }
  }
}

function requiredField(control: FormControl) {
  if (control.value == null) {
    return {
      requiredField: false
    };
  }
  return control.value.toString().trim().length ? null : {
    requiredField: true
  };
}
