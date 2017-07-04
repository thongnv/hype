import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { User } from '../../app.interface';

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
              private mainService: MainService) {
  }

  public onSubmit() {
    this.loaderService.show();
    this.user = this.localStorageService.get('user');
    this.user.showNav = true;
    this.mainService.updateUserInterests(null, this.interests).then((resp) => {
      if (resp.status === null) {
        this.alertType = 'danger';
        this.msgContent = resp.message;
        this.getInterests(this.slugName, this.pageNumber);
      } else {
        this.alertType = 'success';
        this.msgContent = resp.message;
      }
      this.loaderService.hide();
    });
  }

  public getInterests(slugName: string, page: number): void {
    this.mainService.getUserInterest(slugName, page).then((response) => {
      if (response.length > 0) {
        response.forEach((item) => {
          this.interests.push(item);
        });
      }
    });
  }

  public ngOnInit() {
    this.user = this.localStorageService.get('user');
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      if (!this.user.slug || this.slugName !== this.user.slug) {
        this.router.navigate(['/' + this.slugName], {skipLocationChange: true}).then();
      }
      this.getInterests(this.slugName, this.pageNumber);
    });
  }
}
