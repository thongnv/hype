import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AppGlobals } from '../../services/app.global';
import { WindowUtilService } from '../../services/window-ultil.service';
import { LoaderService } from '../../helper/loader/loader.service';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import { ArticlesCategory, Category, Company, HyloEvent } from '../../app.interface';
import { ActivatedRoute } from '@angular/router';
import { CurateService } from '../../services/curate.service';

const ARTICLES_PER_PAGE = 8;

@Component({
  selector: 'app-curated-category',
  templateUrl: './curated-category.component.html',
  styleUrls: ['./curated-category.component.css']
})
export class CuratedCategoryComponent implements OnInit {

  public articlesCategory: ArticlesCategory;

  public categories: Category[];

  public slugName: string;

  public currentPage: number;
  public noMoreArticles: boolean;
  public loadingArticles: boolean;

  public events: HyloEvent[];
  public places: Company[];

  public screenWidth: number = 0;
  public screenHeight: number = 0;
  public layoutWidth: number;
  public innerWidth: number;

  public ready = false;

  public constructor(private titleService: Title,
                     private curateService: CurateService,
                     private smallLoader: SmallLoaderService,
                     private loaderService: LoaderService,
                     private windowRef: WindowUtilService,
                     private route: ActivatedRoute,
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
    this.appGlobal.emitActiveType('guides');
    this.titleService.setTitle('Hylo | Guides');
    this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180);

    this.route.params.subscribe((e) => {
      this.slugName = e.slug;
      this.currentPage = 0;
      this.noMoreArticles = false;
      this.loadingArticles = false;
      this.loaderService.show();
      this.curateService.getArticlesCategory(this.slugName, this.currentPage).subscribe(
        (response: ArticlesCategory) => {
          this.articlesCategory = response;
          this.ready = true;
          this.noMoreArticles = response.total <= ARTICLES_PER_PAGE;
          this.loaderService.hide();
        }
      );
    });

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

    this.curateService.getRandomPlaces().subscribe(
      (response: Company[]) => {
        this.places = response;
      }
    );

    this.curateService.getRandomEvents().subscribe(
      (response: HyloEvent[]) => {
        this.events = response;
      }
    );
  }

  public showMoreArticles() {
    if (!this.loadingArticles) {
      this.loadingArticles = true;
      this.smallLoader.show();
      this.curateService.getArticlesCategory(this.slugName, ++this.currentPage).subscribe(
        (response: ArticlesCategory) => {
          this.articlesCategory.articles = this.articlesCategory.articles.concat(response.articles);
          this.smallLoader.hide();
          this.loadingArticles = false;
          this.noMoreArticles = (this.currentPage + 1) * ARTICLES_PER_PAGE >= response.total;
        }
      );
    }
  }
}
