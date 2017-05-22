import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-curate',
  templateUrl: './curate.component.html',
  styleUrls: ['./curate.component.css']
})
export class CurateComponent implements OnInit {

  public data: any;
  public articles: any;

  public constructor(private mainService: MainService) {
  }

  public ngOnInit() {
    this.data = {lat: 1.390570, lng: 103.351923};
    this.getArticles('latest');
  }

  public getArticles(type: string): void {
    // this.mainService.getArticle(type).then((resp) => {
    //   this.articles = resp;
    // });
  }
}
