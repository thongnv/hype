import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../helper/loader/loader.service';
import { User } from '../../app.interface';
import { AppSetting } from '../../app.setting';
import { UserService } from '../../services/user.service';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import $ from 'jquery';

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
  public reachedFirst = true;
  public reachedEnd = false;
  public noMoreEvents = false;
  public eventIndex = 0;
  public latestArticles = [];
  public sub: any;
  public slugName: any;
  public followed: boolean = false;
  public ready = false;
  public loadingInProgress = false;
  public loadingMore = false;
  public events = [];
  public places = [];
  private listPageNum: number = 0;
  private eventPageNum: number = 0;

  constructor(private loaderService: LoaderService,
              private userService: UserService,
              private smallLoader: SmallLoaderService,
              private localStorageService: LocalStorageService,
              private route: ActivatedRoute) {
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
      this.getArticles();
      this.getEvents();
    });

    $(window).scroll(() => {
      if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
        if (!this.loadingMore && !this.noMoreEvents) {
          this.getMoreEvents();
        }
      }
    });
  }

  public p() {
    // TODO;
  }

  public next() {
    if (!this.loadingInProgress && !this.reachedEnd) {
      this.loadingInProgress = true;
      this.userService.getArticles(this.slugName, ++this.listPageNum).subscribe(
        (response) => {
          if (response.data.length) {
            this.latestArticles = response.data;
            this.reachedFirst = false;
          } else {
            this.reachedEnd = true;
          }
          this.loadingInProgress = false;
          this.smallLoader.hide();
        }
      );
    }
  }

  public prev() {
    this.reachedFirst = this.listPageNum === 0;
    if (!this.loadingInProgress && !this.reachedFirst) {
      this.loadingInProgress = true;
      this.userService.getArticles(this.slugName, --this.listPageNum).subscribe(
        (response) => {
          if (response.data.length) {
            this.latestArticles = response.data;
            this.reachedEnd = false;
          } else {
            this.reachedFirst = true;
          }
          this.loadingInProgress = false;
          this.smallLoader.hide();
        }
      );
    }
  }

  private getArticles() {
    this.smallLoader.show();
    this.userService.getArticles(this.slugName, this.listPageNum).subscribe(
      (response) => {
        if (response.data.length) {
          this.latestArticles = response.data;
        }
        this.smallLoader.hide();
      }
    );
  }

  private getEvents() {
    this.smallLoader.show();
    this.userService.getEvents(this.slugName, this.eventPageNum).subscribe(
      (response) => {
        if (response.data.length) {
          this.events = response.data;
        }
        this.smallLoader.hide();
      }
    );
  }

  private getMoreEvents() {
    if (!this.loadingMore && !this.noMoreEvents) {
      this.loadingMore = true;
      this.smallLoader.show();
      console.log(this.eventPageNum);
      this.userService.getEvents(this.slugName, ++this.eventPageNum).subscribe(
        (response) => {
          if (this.eventIndex < response.total) {
            response.data.forEach((item) => {
              this.eventIndex++;
              this.events.push(item);
            });
            this.eventPageNum = Math.round(this.eventIndex / 5);
          } else {
            this.noMoreEvents = true;
          }
          this.loadingMore = false;
          this.smallLoader.hide();
        }
      );
    }
  }
}
