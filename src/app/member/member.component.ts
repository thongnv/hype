import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../services/main.service';
import { LoaderService } from '../helper/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { User } from '../app.interface';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  public user: User;
  public settingForm = this.fb.group({
    receiveEmail: true
  });

  public alertType = 'danger';
  public msgContent: string;
  public sub: any;
  public slugName: any;

  constructor(private route: ActivatedRoute,
              public fb: FormBuilder,
              public loaderService: LoaderService,
              private localStorageService: LocalStorageService,
              private router: Router,
              private mainService: MainService) {
  }

  public ngOnInit() {
    this.user = this.localStorageService.get('user') as User;
    this.user.showNav = true;
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      if (!this.user.slug || this.slugName !== this.user.slug) {
        this.router.navigate(['/' + this.slugName], {skipLocationChange: true}).then();
      }
    });
  }

  public onSubmit(event): void {
    let data = {
      field_notify_email: this.settingForm.value.email,
      field_first_name: this.user.firstName,
      field_last_name: this.user.lastName,
      email: this.user.email,
      field_contact_number: this.user.contactNumber,
      field_country: '',
      follow: {
        following: this.user.followingNumber,
        follower: this.user.followerNumber,
      }
    };
    this.mainService.setUserProfile(this.user, data).subscribe(
      (resp) => {
        if (resp.status) {
          this.alertType = 'success';
          this.user.email = data.field_notify_email;
        } else {
          this.alertType = 'danger';
          this.settingForm.patchValue({
            receiveEmail: parseInt(this.user.email, 2)
          });
        }
        this.msgContent = resp.message;
      },
      (error) => console.log(error)
    );
    this.user.showNav = true;
  }

}
