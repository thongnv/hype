import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// services
import { AppGlobals } from '../services/app.global';
import { WindowUtilService } from '../services/window-ultil.service';
import {MainService} from '../services/main.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  // properties
  public layoutWidth: number;
  public innerWidth: number;

  // fake data
  public items = [];
  private keywords = '';

  constructor(private appGlobal: AppGlobals,
              private route: ActivatedRoute,
              private windowRef: WindowUtilService,
              private mainService: MainService
              ) { }

  // lifecycle
  ngOnInit() {
    // get keyword
    this.route.params.subscribe(params => this.keywords = params['keywords']);

    // fetch data from server
    this.fetchData(this.keywords);

    // handle frame dimension
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;

    if (this.innerWidth <= 900) {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = false;
    } else {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = true;
    }

    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;

    this.appGlobal.toggleMap = true;
  }

  // methods
  private fetchData(keywords: string) {
    // TODO: need a particular api for this feature
    // TODO: currently use the search in main service
    this.mainService.search(keywords)
      .subscribe(resp => {
        console.log('data: ', resp);
      })
  }

  public onResize(event): void {
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;
  }

}
