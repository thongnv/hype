import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../helper/loader/loader.service';
import { User } from '../../app.interface';
import { AppSetting } from '../../app.setting';
import { UserService } from '../../services/user.service';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import { HomeService } from '../../services/home.service';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-profile-public',
  templateUrl: './profile-public.component.html',
  styleUrls: ['./profile-public.component.css']
})
export class ProfilePublicComponent implements OnInit {

  public user = AppSetting.defaultUser;
  public currentUser: User;
  public favorite: any;
  public selectedFavoriteType: any;
  public isCurrentUser: boolean = false;
  public setList: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };
  public setEvent: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };
  public latestArticles = [];
  public sub: any;
  public slugName: any;
  public followed: boolean = false;
  public ready = false;

  public events = [];
  public places = [];
  public lists = [];
  private listPageNum: number = 0;

  constructor(private homeService: HomeService,
              private loaderService: LoaderService,
              private mainService: MainService,
              private userService: UserService,
              private smallLoader: SmallLoaderService,
              private localStorageService: LocalStorageService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit() {
    this.loaderService.show();
    this.selectedFavoriteType = 'event';
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      this.isCurrentUser = this.user.slug === this.slugName;
      this.userService.getProfile(this.slugName).subscribe(
        (resp) => {
          this.currentUser = resp;
          this.currentUser.showNav = false;
          this.loaderService.hide();
          this.ready = true;
        },
        (error) => console.log(error)
      );
      this.getEvents();
      this.mainService.getCurate('latest', '*', 0, 3).subscribe(
        (response: any) => {
          this.latestArticles = response.data;
        }
      );
    });
  }

  public p() {
    // TODO;
  }

  private getList(slugName?: string, page?: number) {
    if (!this.setList.loadingInProgress) {
      this.smallLoader.show();
      this.setList.endOfList = false;
      this.setList.loadingInProgress = true;
      this.userService.getLists(slugName, page).subscribe(
        (response) => {
          if (response.total > 0) {
            if (this.setList.offset < response.total) {
              response.data.forEach((item) => {
                this.setList.offset++;
                this.lists.push(item);
              });
              this.listPageNum = Math.round(this.setList.offset / PAGE_SIZE);
            } else {
              this.setList.endOfList = true;
            }
          } else {
            this.setList.endOfList = true;
          }
          this.setList.loadingInProgress = false;
          this.smallLoader.hide();
        }
      );
    }
  }

  private getEvents() {
    let params = {
      date: '',
      lat: 1.359,
      latest: '',
      limit: 10,
      long: 103.818,
      order: '',
      page: 0,
      price: '',
      radius: 0,
      start: 0,
      tid: '',
      weekend: '',
      when: ''
    };
    this.homeService.getEvents(params).map((response) => response.json()).subscribe(
      (response) => {
        this.events = response.data;
        this.loaderService.hide();
        this.smallLoader.hide();
      },
      (err) => {
        console.log(err);
        this.loaderService.hide();
        this.smallLoader.hide();
      });
  }
}
