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
  public pageNumber: number = 0;
  public sub: any;
  public slugName: any;

  constructor(private route: ActivatedRoute,
              private loaderService: LoaderService,
              private localStorageService: LocalStorageService,
              private router: Router,
              private userService: UserService) {
  }

  public onSubmit() {
    this.loaderService.show();
    this.user = this.localStorageService.get('user') as User;
    this.user.showNav = true;
    this.userService.updateUserInterests(null, this.interests).subscribe(
      (resp) => {
        if (resp.status === null) {
          this.alertType = 'danger';
          this.msgContent = resp.message;
          this.getInterests(this.slugName, this.pageNumber);
        } else {
          this.alertType = 'success';
          this.msgContent = resp.message;
        }
        this.loaderService.hide();
      }
    );
  }

  public getInterests(slugName: string, page: number): void {
    this.userService.getUserInterest(slugName, page).subscribe(
      (response) => {
        if (response.length > 0) {
          response.forEach((item) => {
            this.interests.push(item);
          });
        }
      }
    );
  }

  public ngOnInit() {
    this.user = this.localStorageService.get('user') as User;
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      if (!this.user.slug || this.slugName !== this.user.slug) {
        this.router.navigate(['/' + this.slugName], {skipLocationChange: true}).then();
      }
      this.getInterests(this.slugName, this.pageNumber);
    });
  }
}
