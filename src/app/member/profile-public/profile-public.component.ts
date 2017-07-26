import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../helper/loader/loader.service';
import { User } from '../../app.interface';
import { AppSetting } from '../../app.setting';
import { UserService } from '../../services/user.service';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import $ from 'jquery';
import { Title } from '@angular/platform-browser';

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
  public latestArticles = [];
  public sub: any;
  public slugName: any;
  public followed: boolean = false;
  public ready = false;
  public loadingInProgress = false;
  public loadingMore = false;
  public articles = [];
  public events = [];
  public places = [];
  private eventPageNum: number = 0;
  private articlePageNum: number = 0;
  private articleIndex = 0;
  private totalArticles: number;
  private eventIndex: number = 0;

  constructor(private titleService: Title,
              private loaderService: LoaderService,
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
          this.titleService.setTitle(this.currentUser.name);
          this.currentUser.showNav = false;
          this.loaderService.hide();
          this.ready = true;
        },
        (error) => console.log(error)
      );
      this.smallLoader.show();
      this.userService.getArticles(this.slugName).subscribe(
        (response) => {
          this.totalArticles = response.data.length;
          if (this.totalArticles) {
            this.articles = response.data;
            this.latestArticles = this.articles.slice(0, 3);
            this.reachedEnd = this.totalArticles < 4;
          }
          this.smallLoader.hide();
        }
      );
      this.userService.getEvents(this.slugName, this.eventPageNum).subscribe(
        (response) => {
          if (response.data.length) {
            this.events = response.data;
          }
        }
      );
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
    if (!this.reachedEnd) {
      this.articlePageNum++;
      this.articleIndex = this.articlePageNum * 3;
      if (this.articleIndex > this.totalArticles) {
        this.articleIndex = this.totalArticles;
      }
      this.reachedFirst = false;
      this.reachedEnd = this.articleIndex + 3 >= this.totalArticles;
      this.latestArticles = this.articles.slice(this.articleIndex, this.articleIndex + 3);
      console.log(this.articleIndex);
    }
  }

  public prev() {
    if (!this.reachedFirst) {
      this.articlePageNum--;
      this.articleIndex = this.articlePageNum * 3;
      this.reachedEnd = false;
      this.reachedFirst = this.articleIndex <= 0;
      if (this.articleIndex < 0) {
        this.articleIndex = 0;
      }
      this.latestArticles = this.articles.slice(this.articleIndex, this.articleIndex + 3);
    }
    console.log(this.articleIndex);
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
