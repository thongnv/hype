import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-curate',
  templateUrl: './curate.component.html',
  styleUrls: ['./curate.component.css'],
  providers: [NgbCarouselConfig]
})
export class CurateComponent implements OnInit {
  public data: any;
  public articles: any[];
  public featuredArticles: any[] = [];
  public latestArticles: any[] = [];
  public categories: any[];
  public trending: any[];
  public selectedCategory: any;
  public constructor(private mainService: MainService, public config: NgbCarouselConfig) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
  }

  public ngOnInit() {
    this.data = {lat: 1.390570, lng: 103.351923};
    this.getArticles();
  }

  public getArticles(): void {
    this.mainService.getUserPublicProfile().then((resp) => {
      this.categories = resp.categories;
      this.categories.unshift({id: 'all', name: 'All'});
      this.selectedCategory = this.categories[0].id;
      this.trending = resp.trending;
      this.articles = resp.curate_list;
      this.articles.forEach((item) => {
        if (item.info.type === 'popular_pick') {
          this.featuredArticles.push(item);
        } else {
          this.latestArticles.push((item));
        }
      });
      console.log('featuredArticles: ', this.featuredArticles);
      console.log('latestArticles: ', this.latestArticles);
      console.log('selectedCategory: ', this.selectedCategory);
    });
  }

  public onSelectCategory(cat: any) {
    this.selectedCategory = cat;
  }
}
