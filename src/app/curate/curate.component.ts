import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { LoaderService } from '../shared/loader/loader.service';

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

  public constructor(private mainService: MainService,
                     private loaderService: LoaderService) {
  }

  public ngOnInit() {
    this.loaderService.show();
    this.mainService.getCategoryArticle().subscribe(
      (response: any) => {
        this.categories = response.data;
        this.categories.unshift({
          name: 'All',
          tid: 'all',
        });
      }
    );

    this.mainService.getCurate('latest', '*').subscribe(
      (response: any) => {
        this.latestArticles = response.data;
      }
    );

    this.mainService.getCurateTrending('all').subscribe(
      (response) => {
        this.trending = response.data;
      }
    );

    this.mainService.getCurate('feature', '*').subscribe(
      (response: any) => {
        this.featuredArticles = response.data;
        this.processFeature(this.featuredArticles);
        this.loaderService.hide();
      }
    );
  }

  public processFeature(feature) {
    let featuredArticles = [];
    while (feature.length > 0) {
      featuredArticles.push(feature.splice(0, 3));
    }
    this.featuredArticles = featuredArticles;
  }

  public onSelectCategory(cat: any) {
    this.loaderService.show();
    this.selectedCategory = cat;

    this.mainService.getCurate('latest', cat).subscribe(
      (response: any) => {
        this.latestArticles = response.data;
      }
    );

    this.mainService.getCurateTrending(cat).subscribe(
      (response) => {
        this.trending = response.data;
      }
    );

    this.mainService.getCurate('feature', cat).subscribe(
      (response: any) => {
        this.featuredArticles = response.data;
        this.processFeature(this.featuredArticles);
        this.loaderService.hide();
      }
    );
  }
}
