import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../helper/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { User } from '../../app.interface';
import { UserService } from '../../services/user.service';
import { AppSetting } from '../../app.setting';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})

export class InterestComponent implements OnInit {
  public msgContent: string;
  public alertType: string;
  public user = AppSetting.defaultUser;
  public interests: any[] = [];
  public sub: any;
  public slugName: any;
  public ready = false;

  constructor(private route: ActivatedRoute,
              private loaderService: LoaderService,
              private localStorageService: LocalStorageService,
              private userService: UserService) {
  }

  public ngOnInit() {
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params.slug;
      this.userService.getInterests(this.slugName).subscribe(
        (response) => {
          if (response.length > 0) {
            response.forEach((item) => {
              this.interests.push(item);
            });
          }
          this.ready = true;
        }
      );
    });
  }

  public onSubmit() {
    this.loaderService.show();
    this.user.showNav = true;
    this.userService.updateInterests(null, this.interests).subscribe(
      (resp) => {
        if (resp.status) {
          this.alertType = 'success';
        } else {
          this.alertType = 'danger';
        }
        this.msgContent = resp.message;
        this.loaderService.hide();
      }
    );
  }
}
