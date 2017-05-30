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
  public categories: any[];
  public trending: any[];
  public selectedCategory: any;
  public constructor(private mainService: MainService) {
  }
  public ngOnInit() {
    this.data = {lat: 1.390570, lng: 103.351923};
    this.getArticles();
  }
  public getArticles(): void {
    this.mainService.getUserPublicProfile().then((resp) => {
      this.articles = resp.curate_list;
      this.categories = resp.categories;
      this.trending = resp.trending;
    });
  }
  public onSelectCategory(cat: any){
    this.selectedCategory = cat;
  }
}
