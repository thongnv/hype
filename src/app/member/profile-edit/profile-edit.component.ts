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
              private localStorageService: LocalStorageService,
              private loaderService: LoaderService,
              private countryPickerService: CountryPickerService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private profileService: ProfileService) {
  }

  public ngOnInit() {
    this.user = this.localStorageService.get('user') as User;
    if (this.user.isAnonymous || this.slugName !== this.user.slug) {
      this.router.navigate(['/' + this.user.slug]).then();
    }
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
      this.loaderService.show();
      this.userService.getUserProfile(this.slugName).subscribe(
        (resp) => {
          this.user = resp.user;
          this.profileForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            contactNumber: this.user.contactNumber,
            country: '',
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
      this.userService.setUserProfile(this.user, data).subscribe(
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
