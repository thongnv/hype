import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../helper/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { User } from '../../app.interface';
import { UserService } from '../../services/user.service';
import { WindowUtilService } from '../../services/window-ultil.service';
import { NotificationsService } from 'angular2-notifications';
import { AppGlobals } from '../../services/app.global';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})

export class InterestComponent implements OnInit {
  public user: User;
  public interests: any[] = [];
  public sub: any;
  public slugName: any;
  public ready = false;
  public layoutWidth: number;
  public options = {
    timeOut: 3000,
    pauseOnHover: false,
    clickToClose: false,
    position: ['bottom', 'right'],
    icons: 'success',
    showProgressBar: false
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private loaderService: LoaderService,
              private localStorageService: LocalStorageService,
              private userService: UserService,
              private notificationsService: NotificationsService,
              private windowRef: WindowUtilService,
              private appGlobal: AppGlobals,
  ) {
  }

  public ngOnInit() {
    this.appGlobal.toggleMap = false;
    this.user = this.localStorageService.get('user') as User;
    if (!this.user) {
      this.router.navigate(['login']).then();
    }
    this.layoutWidth = (this.windowRef.rootContainer.width - 80);
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params.slug;
      if (params.slug !== this.user.slug) {
        this.router.navigate(['/' + params.slug]).then();
      }
      this.userService.getProfile().subscribe((response) => {
        this.user = response;
        this.user.slug = this.slugName;
        this.ready = true;
      });
      this.userService.getInterests(this.user.slug).subscribe(
        (response) => {
          if (response.length > 0) {
            response.forEach((item) => {
              this.interests.push(item);
            });
          }
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
          this.notificationsService.success(
            'Update interests',
            'Your interests has been updated successfully.',
          );
        } else {
          this.notificationsService.error(
            'Update interests',
            resp.message,
            {
              icons: 'error'
            }
          );
        }
        this.loaderService.hide();
      }
    );
  }
}
