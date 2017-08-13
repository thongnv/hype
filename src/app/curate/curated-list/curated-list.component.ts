import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AppGlobals } from '../../services/app.global';
import { WindowUtilService } from '../../services/window-ultil.service';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import { Article, Category, Company, HyloEvent } from '../../app.interface';
import { CurateService } from '../../services/curate.service';

@Component({
  selector: 'app-curated-list',
  templateUrl: './curated-list.component.html',
  styleUrls: ['./curated-list.component.css']
})
export class CuratedListComponent implements OnInit {

  public categories: Category[];

  public featuredArticles: Article[];
  public editorsPickArticles: Article[];
  public trendingArticles: Article[];
  public trendingEvents: HyloEvent[];
  public trendingPlaces: Company[];

  public communityArticles: Article[];
  public showingArticlesTab = true;
  public showingEventsTab = false;
  public showingPlacesTab = false;

  public featuredArticlesSlides = [];

  public slides: any[] = [];
  public NextPhotoInterval: number = 10000;
  public noLoopSlides: boolean = false;
  public noPause: boolean = true;
  public noTransition: boolean = true;

  public currentEditorsPickPage = 0;
  public currentCommunityPage = 0;
  public endList = false;
  public loading = false;

  public loadingEditorsPickArticles = false;
  public loadingCommunityArticles = false;

  public screenWidth: number = 0;
  public screenHeight: number = 0;
  public layoutWidth: number;
  public innerWidth: number;

  public ready = false;

  public constructor(private titleService: Title,
                     private curateService: CurateService,
                     private smallLoader: SmallLoaderService,
                     private windowRef: WindowUtilService,
                     private appGlobal: AppGlobals) {
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    console.log(event);
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180);
  }

  public ngOnInit() {
    this.appGlobal.toggleMap = false;
    this.titleService.setTitle('Curated List');
    window.onscroll = () => {
      let windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
      let body = document.body;
      let html = document.documentElement;
      let docHeight = Math.max(body.scrollHeight,
        body.offsetHeight, html.clientHeight,
        html.scrollHeight, html.offsetHeight);
      let windowBottom = windowHeight + window.pageYOffset;

      if (windowBottom >= docHeight) {
        // this.loadMore();
      }
    };

    this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180);

    this.curateService.getArticleCategories().subscribe(
      (response: Category[]) => {
        this.categories = response;
        this.categories.unshift({
          id: null,
          name: 'all',
          alias: '/guides',
          children: []
        });
      }
    );

    this.curateService.getFeaturedArticles().subscribe(
      (response: Article[]) => {
        this.featuredArticles = response;
        this.featuredArticlesSlides = calculateFeaturedArticlesSlides(this.featuredArticles, this.screenWidth);
        this.ready = true;
      }
    );

    this.curateService.getEditorsPickArticles(this.currentEditorsPickPage).subscribe(
      (response: Article[]) => {
        this.editorsPickArticles = response;
      }
    );

    this.showArticlesTab();

    this.curateService.getCommunityArticles(this.currentCommunityPage).subscribe(
      (response: Article[]) => {
        this.communityArticles = response;
      }
    );

  }

  public showArticlesTab() {
    this.curateService.getTrendingArticles().subscribe(
      (response: Article[]) => {
        this.trendingArticles = response;
      }
    );
    this.showingArticlesTab = true;
    this.showingEventsTab = false;
    this.showingPlacesTab = false;
  }

  public showEventsTab() {
    this.curateService.getTrendingEvents().subscribe(
      (response: HyloEvent[]) => {
        this.trendingEvents = response;
      }
    );
    this.showingArticlesTab = false;
    this.showingEventsTab = true;
    this.showingPlacesTab = false;
  }

  public showPlacesTab() {
    this.curateService.getTrendingPlaces().subscribe(
      (response: Company[]) => {
        this.trendingPlaces = response;
      }
    );
    this.showingArticlesTab = false;
    this.showingEventsTab = false;
    this.showingPlacesTab = true;
  }

  public showMoreEditorsPickArticles() {
    if (!this.loadingEditorsPickArticles) {
      this.loadingEditorsPickArticles = true;
      this.smallLoader.show();
      this.curateService.getEditorsPickArticles(++this.currentEditorsPickPage).subscribe(
        (response: Article[]) => {
          this.editorsPickArticles = this.editorsPickArticles.concat(response);
          this.loadingEditorsPickArticles = false;
          this.smallLoader.hide();
        }
      );
    }
  }

  public showMoreCommunityArticles() {
    if (!this.loadingCommunityArticles) {
      this.loadingCommunityArticles = true;
      this.smallLoader.show();
      this.curateService.getCommunityArticles(++this.currentCommunityPage).subscribe(
        (response: Article[]) => {
          this.communityArticles = this.communityArticles.concat(response);
          this.loadingCommunityArticles = false;
          this.smallLoader.hide();
        }
      );
    }
  }
}

function calculateFeaturedArticlesSlides(featuredArticles, screenWidth): Article[] {
  const results = [];
  let numberPost: number;
  if (screenWidth < 767) {
    numberPost = 1;
  } else if (screenWidth < 992) {
    numberPost = 2;
  } else {
    numberPost = 3;
  }
  while (featuredArticles.length > 0) {
    results.push(featuredArticles.splice(0, numberPost));
  }
  return results;
}
