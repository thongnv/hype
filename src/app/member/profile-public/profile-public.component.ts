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
import { WindowUtilService } from '../../services/window-ultil.service';
import { AppGlobals } from '../../services/app.global';

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
  public loading = false;
  public sub: any;
  public slugName: any;
  public followed: boolean = false;
  public ready = false;
  public loadingInProgress = false;
  public loadingMore = false;
  public articles = [];
  public events = [];
  public places = [];
  public layoutWidth: number;
  public innerWidth: number;
  private eventPageNum: number = 0;
  private articlePageNum: number = 0;
  private articleIndex = 0;
  private totalArticles: number;
  private eventIndex: number = 0;
  private articlesPerPage = 3;

  constructor(private titleService: Title,
              private loaderService: LoaderService,
              private userService: UserService,
              private smallLoader: SmallLoaderService,
              private localStorageService: LocalStorageService,
              private appGlobal: AppGlobals,
              private route: ActivatedRoute,
              private windowRef: WindowUtilService) {
  }

  public ngOnInit() {
    this.loaderService.show();
    this.appGlobal.emitActiveType('');
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
      this.loading = true;
      this.userService.getArticles(this.slugName).subscribe(
        (response) => {
          this.totalArticles = response.data.length;
          if (this.totalArticles) {
            this.articles = response.data;
            this.latestArticles = this.articles.slice(0, this.articlesPerPage);
            this.reachedEnd = this.totalArticles <= this.articlesPerPage;
          }
          this.smallLoader.hide();
          this.loading = false;
        }
      );
      this.userService.getEvents(this.slugName, this.eventPageNum).subscribe(
        (response) => {
          if (response.data.length) {
            this.events = response.data;
          }
        }
      );
      this.articlesPerPage = calculateArticlesPerPage();
      this.innerWidth = this.windowRef.nativeWindow.innerWidth;
      this.layoutWidth = (this.windowRef.rootContainer.width - 180);
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
    // hack to get rid of warning
  }

  public onResize(event): void {
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    let navBarWidth = 180;
    this.layoutWidth = this.windowRef.rootContainer.width - navBarWidth;
  }

  public next() {
    if (!this.reachedEnd) {
      this.articlePageNum++;
      this.articleIndex = this.articlePageNum * this.articlesPerPage;
      if (this.articleIndex > this.totalArticles) {
        this.articleIndex = this.totalArticles;
      }
      this.reachedFirst = false;
      this.reachedEnd = this.articleIndex + this.articlesPerPage >= this.totalArticles;
      this.latestArticles = this.articles.slice(this.articleIndex, this.articleIndex + this.articlesPerPage);
    }
  }

  public prev() {
    if (!this.reachedFirst) {
      this.articlePageNum--;
      this.articleIndex = this.articlePageNum * this.articlesPerPage;
      this.reachedEnd = false;
      this.reachedFirst = this.articleIndex <= 0;
      if (this.articleIndex < 0) {
        this.articleIndex = 0;
      }
      this.latestArticles = this.articles.slice(this.articleIndex, this.articleIndex + this.articlesPerPage);
    }
  }

  private getMoreEvents() {
    if (!this.loadingMore && !this.noMoreEvents) {
      this.loadingMore = true;
      this.smallLoader.show();
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

function calculateArticlesPerPage(): number {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  let numArticles: number;
  let containerWidth: number;
  let articleWidth = 225;
  const navBarWidth = 180;
  const memberNavWith = 320;
  const borderWidth = 15;
  const carouselControlWidth = 40;
  if (screenWidth > 992) {
    articleWidth = screenWidth * 0.17;
    containerWidth = screenWidth - navBarWidth - memberNavWith - borderWidth - carouselControlWidth;
  } else {
    if (screenWidth <= 320) {
      articleWidth = 135;
    } else if (screenWidth <= 768) {
      articleWidth = 165;
    }
    containerWidth = screenWidth - carouselControlWidth;
  }
  numArticles = Math.round(containerWidth / articleWidth);
  return numArticles;
}
