import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../helper/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { User } from '../../app.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})

export class InterestComponent implements OnInit {
  public msgContent: string;
  public alertType: string;
  public user: User;
  public interests: any[] = [];
  public sub: any;
  public slugName: any;
  public ready = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private loaderService: LoaderService,
              private localStorageService: LocalStorageService,
              private userService: UserService) {
  }

  public ngOnInit() {
    this.user = this.localStorageService.get('user') as User;
    if (!this.user) {
      this.router.navigate(['login']).then();
    }
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params.slug;
      if (params.slug !== this.user.slug) {
        this.router.navigate(['/' + params.slug]).then();
      }
      this.userService.getProfile().subscribe((response) => {
        this.user = response.user;
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
