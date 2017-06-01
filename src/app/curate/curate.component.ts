import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';

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
  public selectedCategory: any;
  public NextPhotoInterval: number = 3000;
  public noLoopSlides: boolean = false;
  public noPause: boolean = true;
  public noTransition: boolean = false;

  public constructor(private mainService: MainService) {
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
    });
  }

  public onSelectCategory(cat: any) {
    this.selectedCategory = cat;
  }
}
