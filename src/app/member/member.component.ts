import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../helper/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { User } from '../app.interface';
import { UserService } from '../services/user.service';
import { AppSetting } from '../app.setting';
import { WindowUtilService } from '../services/window-ultil.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  public user = AppSetting.defaultUser;
  public currentUser: User;
  public settingForm = this.formBuilder.group({receiveEmail: true});
  public sub: any;
  public slugName: string;
  public disabled = true;
  public acceptNotification: any;
  public ready = false;
  public layoutWidth: number;
  public options = {
    timeOut: 5000,
    pauseOnHover: false,
    clickToClose: false,
    position: ['bottom', 'right'],
    icons: 'success',
  };

  constructor(private route: ActivatedRoute,
              public formBuilder: FormBuilder,
              public loaderService: LoaderService,
              public userService: UserService,
              private localStorageService: LocalStorageService,
              private router: Router,
              private notificationsService: NotificationsService,
              private windowRef: WindowUtilService) {
  }

  public ngOnInit() {
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.user.showNav = true;
    this.loaderService.show();
    this.layoutWidth = (this.windowRef.rootContainer.width - 181);
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
          this.notificationsService.success(
            'Update Profile',
            'Your profile has been successfully updated.',
          );
          this.settingForm.patchValue({
            receiveEmail: data.field_notify_email
          });
        } else {
          this.notificationsService.error(
            'Update Profile',
            resp.message,
            {
              icons: 'error'
            }
          );
        }
      },
      (error) => console.log(error)
    );
    this.user.showNav = true;
  }

}
