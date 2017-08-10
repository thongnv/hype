import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
  public currentType = 'events';
  public items = {data: []};
  private events = {total: 0, data: []};
  private lists = {total: 0, data: []};
  private places = {total: 0, data: []};

  private keywords = '';

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

  public changeTab(type: string) {
    this.currentType = type;
    switch (this.currentType) {
      case 'events':
        this.items = this.events; break;
      case 'lists':
        this.items = this.lists;
        break;
      case 'places':
        this.items = this.places; break;
      default:
        this.items = this.events;
        this.currentType = 'events';
        break;
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
