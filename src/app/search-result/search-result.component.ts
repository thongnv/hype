import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
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
  @Output('onClickVote') public onClickVote = new EventEmitter<any>();

  // properties
  public layoutWidth: number;
  public innerWidth: number;

  // fake data
  public currentType = 'event';
  public items = {data: []};
  private events = {total: 0, data: []};
  private lists = {total: 0, data: []};
  private places = {total: 0, data: []};

  private keywords = '';
  private loadMoreParams = {
    page: 1,
    type: 'event',
  };

  constructor(private appGlobal: AppGlobals,
              private route: ActivatedRoute,
              private windowRef: WindowUtilService,
              private dataService: MainService
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
    this.dataService.searchResult(keywords)
      .subscribe(resp => {
        this.events = {total: resp.event.total, data: resp.event.items};
        this.lists = {total: resp.list.total, data: resp.list.items};
        this.places = {total: resp.place.total, data: resp.place.items};
        this.items = this.events;

      });
  }

  private loadMore() {
    this.loadMoreParams.type = this.currentType;

    console.log('start loadmore data: ', this.loadMoreParams);
    
    this.dataService.searchResultLoadMore(this.keywords, this.loadMoreParams)
      .subscribe(
        data => {
          console.log('data: ', data);
          this[this.loadMoreParams.type] = this[this.loadMoreParams.type].concat(data[this.loadMoreParams.type].items);
          this.loadMoreParams.page++;
        },
        error => console.error('load more search result error: ', error),
        () => console.log('load more completed'));
  }

  public changeTab(type: string) {
    this.currentType = type;
    switch (this.currentType) {
      case 'event':
        this.items = this.events; break;
      case 'list':
        this.items = this.lists;
        break;
      case 'place':
        this.items = this.places; break;
      default:
        this.items = this.events;
        this.currentType = 'event';
        break;
    }
  }

  // events handler
  @HostListener('window:scroll', ['$event'])
  public onScrollWindow() {
    const currentPosition = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    const maxHeight = document.documentElement.scrollHeight;

    if (currentPosition === maxHeight) {
     console.log('start load data');
     this.loadMore();
    }

  }

  public onVoteEvent(item: number): void {
    this.onClickVote.emit(item);
  }

  public onResize(event): void {
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;
  }

}
