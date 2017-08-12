import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { MainService } from '../../services/main.service';
import { AppGlobals } from '../../services/app.global';
import { WindowUtilService } from '../../services/window-ultil.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import { Article, Category, Company, HyloEvent } from '../../app.interface';

@Component({
  selector: 'app-curated-list',
  templateUrl: './curated-list.component.html',
  styleUrls: ['./curated-list.component.css']
})
export class CuratedListComponent implements OnInit {

  public featuredArticles: Article[];
  public editorsPickArticles: Article[];
  public trendingArticles: Article[];
  public trendingEvents: HyloEvent[];
  public trendingPlaces: Company[];
  public communityArticles: Article[];

  public categories: Category[];

  public slides: any[] = [];
  public NextPhotoInterval: number = 10000;
  public noLoopSlides: boolean = false;
  public noPause: boolean = true;
  public noTransition: boolean = true;

  public currentPage: number = 0;
  public endList: boolean = false;
  public loading: boolean = false;

  public screenWidth: number = 0;
  public screenHeight: number = 0;
  public layoutWidth: number;
  public innerWidth: number;

  public constructor(private titleService: Title,
                     private mainService: MainService,
                     private smallLoader: SmallLoaderService,
                     private loaderService: LoaderService,
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
    window.scroll(0, 0);
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
        this.loadMore();
      }
    };

    this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180);

    this.loaderService.show();
    this.mainService.getCategoryTreeArticle().subscribe(
      (response: any) => {
        let categories = response.data;
        this.categories = extractCategories(categories);
        this.categories.unshift({
          id: null,
          name: 'all',
          alias: '/guides',
          children: []
        });
      }
    );

    this.mainService.getCurate('latest', '*', 0, 9).subscribe(
      (response: any) => {
        this.editorsPickArticles = response.data;
        this.currentPage = 1;
      }
    );

    this.mainService.getCurateTrending().subscribe(
      (response) => {
        this.trendingArticles = response.data;
      }
    );

    this.mainService.getCurate('feature', '*', 0, 9).subscribe(
      (response: any) => {
        this.featuredArticles = response.data;
        this.processFeature(this.featuredArticles);
        this.loaderService.hide();
      }
    );
  }

  public processFeature(feature) {
    let numberPost = 3;
    let featuredArticles = [];
    if (this.screenWidth < 992) {
      if (this.screenWidth < 767) {
        numberPost = 1;
      } else {
        if (this.screenWidth > 767 && this.screenWidth < 992) {
          console.log(234, this.screenWidth);
          numberPost = 2;
        }
      }
    } else {
      numberPost = 3;
    }
    while (feature.length > 0) {
      featuredArticles.push(feature.splice(0, numberPost));
    }
    this.featuredArticles = featuredArticles;
  }

  public onSelectCategory(event, cat: any) {
    event.stopPropagation();
    this.loaderService.show();
    this.currentPage = 0;
    this.loading = false;
    this.endList = false;

    this.mainService.getCurate('latest', cat, 0, 9).subscribe(
      (response: any) => {
        this.editorsPickArticles = response.data;
        this.currentPage = this.currentPage + 1;
      }
    );

    this.mainService.getCurateTrending().subscribe(
      (response) => {
        this.trendingArticles = response.data;
      }
    );

    this.mainService.getCurate('feature', cat, 0, 9).subscribe(
      (response: any) => {
        this.featuredArticles = response.data;
        this.processFeature(this.featuredArticles);
        this.loaderService.hide();
      }
    );
  }

  public loadMore() {
    if (!this.endList) {
      this.smallLoader.show();
      this.loading = true;
      if (this.currentPage >= 1) {
        this.mainService.getCurate('latest', 'all', this.currentPage, 9).subscribe(
          (response: any) => {
            this.editorsPickArticles = this.editorsPickArticles.concat(response.data);
            if (this.currentPage * 9 > response.total) {
              this.endList = true;
            }
            this.currentPage = this.currentPage + 1;
            this.smallLoader.hide();
            this.loading = false;
          }
        );
      }
    }

  }
}

function extractCategories(obj): Category[] {
  const categories = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const category = obj[key];
      if (!category.hasOwnProperty('children')) {
        category.children = [];
      }
      categories.push(obj[key]);
    }
  }
  return categories;
}
