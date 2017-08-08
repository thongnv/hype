import { Component, HostListener, OnInit} from '@angular/core';
import { MainService } from '../services/main.service';
import { LoaderService } from '../helper/loader/loader.service';
import { SmallLoaderService } from '../helper/small-loader/small-loader.service';
import { WindowUtilService } from '../services/window-ultil.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-curate',
  templateUrl: './curate.component.html',
  styleUrls: ['./curate.component.css']
})
export class CurateComponent implements OnInit {
  public data: any;
  public articles: any[];
  public featuredArticles: any[] = [];
  public latestArticles: any[] = [];
  public categories: any[];
  public trending: any[];
  public slides: any[] = [];
  public selectedCategory: any = 'all';
  public NextPhotoInterval: number = 3000;
  public noLoopSlides: boolean = false;
  public noPause: boolean = true;
  public noTransition: boolean = false;
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
                     private windowRef: WindowUtilService) {
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(this.windowRef.rootContainer);

    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 182);

  }
  public ngOnInit() {
    window.scroll(0, 0);
    this.titleService.setTitle('Curated List');
    this.loaderService.show();
    window.onscroll = () => {
      let windowHeight = 'innerHeight' in window ? window.innerHeight
        : document.documentElement.offsetHeight;
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

    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    this.screenWidth = width;
    this.screenHeight = height;

    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 182);

    this.mainService.getCategoryTreeArticle().subscribe(
      (response: any) => {
        let categories = response.data;
        this.categories = this.convertObject2Array(categories);
        this.categories.unshift({
          0: 'All',
          1: 'all',
        });
      }
    );

    this.mainService.getCurate('latest', '*', 0, 9).subscribe(
      (response: any) => {
        this.latestArticles = response.data;
        this.currentPage = 1;
      }
    );

    this.mainService.getCurateTrending().subscribe(
      (response) => {
        this.trending = response.data;
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

  public onSelectCategory(event,  cat: any) {
    event.stopPropagation();
    this.loaderService.show();
    this.selectedCategory = cat;
    this.currentPage = 0;
    this.loading = false;
    this.endList = false;

    this.mainService.getCurate('latest', cat, 0, 9).subscribe(
      (response: any) => {
        this.latestArticles = response.data;
        this.currentPage = this.currentPage + 1;
      }
    );

    this.mainService.getCurateTrending().subscribe(
      (response) => {
        this.trending = response.data;
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
    if (!this.endList && !this.loading) {
      this.smallLoader.show();
      this.loading = true;
      this.mainService.getCurate('latest', this.selectedCategory, this.currentPage, 9).subscribe(
        (response: any) => {
          this.latestArticles = this.latestArticles.concat(response.data);
          if (this.currentPage * 9 > response.total) {
            this.endList = true;
          }
          this.currentPage = this.currentPage + 1;
          this.loading = true;
          this.smallLoader.hide();
          this.loading = false;
        }
      );
    }
  }

  private convertObject2Array(obj) {
    let newObj = Object.keys(obj).map(
      (k) => {
        if (typeof(obj[k]) === 'object') {
         return this.convertObject2Array(obj[k]);
        }
        return obj[k];
      }
    );
    return newObj;
  }
}
