import { Component, OnInit, EventEmitter, Output, HostListener, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

// services
import { AppGlobals } from '../services/app.global';
import { WindowUtilService } from '../services/window-ultil.service';
import {MainService} from '../services/main.service';
import { SmallLoaderService } from '../helper/small-loader/small-loader.service';


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
  public items = {total: 0, page: 0, data: []};

  private events = {total: 0, page: 0, data: []};
  private lists = {total: 0, page: 0, data: []};
  private places = {total: 0, page: 0, data: []};

  private keywords = '';
  private loadMoreParams = {
    page: 1,
    type: 'event',
  };

  constructor(private appGlobal: AppGlobals,
              private router: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private windowRef: WindowUtilService,
              private smallLoader: SmallLoaderService,
              private dataService: MainService
              ) { }

  // lifecycle
  ngOnInit() {
    // get keyword
    this.router.queryParams.subscribe(params => this.keywords = params['keywords']);

    // sanitize keywords
    // this.keywords = this.sanitizer.sanitize(SecurityContext.HTML, this.keywords);

    console.log('got keywords: ', this.keywords);

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

    this.layoutWidth = (this.windowRef.rootContainer.width - 180);

    this.appGlobal.toggleMap = true;
  }

  // methods
  private fetchData(keywords: string) {
    this.dataService.searchResult(keywords)
      .subscribe(resp => {
        this.events = {total: resp.event.total, page: 0, data: resp.event.items};
        this.lists = {total: resp.list.total, page: 0, data: resp.list.items};
        this.places = {total: resp.place.total, page: 0, data: resp.place.items};
        this.items = this.events;

      });
  }

  private loadMore() {
    let self = this;
    this.loadMoreParams.type = this.currentType;
    this.loadMoreParams.page = this[this.currentType + 's'].page;

    // only send request if not EOD
    const totalItem = this[this.currentType + 's'].total;
    let cond = false;

    if (totalItem > 10) {
      cond = this.loadMoreParams.page * 10 < this[this.currentType + 's'].total;
    }

    if (cond) {
      this.smallLoader.show();
      this.dataService.searchResultLoadMore(this.keywords, this.loadMoreParams)
        .subscribe(
          function(data) {
            const myDataType = self.loadMoreParams.type + 's';
            const serverDataType = self.loadMoreParams.type;

            self[myDataType].data = self[myDataType].data.concat(data[serverDataType].items);
            self[myDataType].page += 1;

            self.smallLoader.hide();
          }
        );
    } else {
      // console.log('EOD');
    }

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
     this.loadMore();
    }

  }

  public onVoteEvent(item: number): void {
    this.onClickVote.emit(item);
  }

  public onResize(): void {
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180);
  }

}
