import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../helper/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { User } from '../app.interface';
import { UserService } from '../services/user.service';
import { AppSetting } from '../app.setting';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  public user = AppSetting.defaultUser;
  public currentUser: User;
  public settingForm = this.formBuilder.group({receiveEmail: true});
  public alertType = 'danger';
  public msgContent: string;
  public sub: any;
  public slugName: string;
  public disabled = true;
  public acceptNotification: any;
  public ready = false;

  constructor(private route: ActivatedRoute,
              public formBuilder: FormBuilder,
              public loaderService: LoaderService,
              public userService: UserService,
              private localStorageService: LocalStorageService,
              private router: Router) {
  }

  public ngOnInit() {
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.user.showNav = true;
    this.loaderService.show();
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      if (!this.user.slug || this.slugName !== this.user.slug) {
        this.router.navigate(['/' + this.slugName], {skipLocationChange: true}).then();
      }
      this.userService.getProfile(this.slugName).subscribe(
        (resp) => {
          this.currentUser = resp;
          this.acceptNotification = this.currentUser.acceptNotification;
          this.settingForm.patchValue({
            receiveEmail: this.acceptNotification
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

  public onChange(event) {
    this.msgContent = '';
    if (this.acceptNotification !== this.settingForm.value.receiveEmail) {
      this.acceptNotification = this.settingForm.value.receiveEmail;
      this.disabled = false;
    }
  }

  public onSubmit(): void {
    this.disabled = true;
    let data = {
      field_notify_email: this.settingForm.value.receiveEmail
    };
    this.userService.setProfile(this.user, data).subscribe(
      (resp) => {
        if (resp.status) {
          this.alertType = 'success';
          this.settingForm.patchValue({
            receiveEmail: data.field_notify_email
          });
        } else {
          this.alertType = 'danger';
        }
        this.msgContent = resp.message;
      },
      (error) => console.log(error)
    );
    this.user.showNav = true;
  }

}
