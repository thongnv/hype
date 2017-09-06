import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import {  } from '@types/googlemaps';
import * as moment from 'moment/moment';
import { Location } from '@angular/common';
import { any } from 'codelyzer/util/function';
import { MapsAPILoader } from 'angular2-google-maps/core/services/maps-api-loader/maps-api-loader';
import $ from 'jquery';

import { HomeService } from '../services/home.service';
import { LoaderService } from '../helper/loader/loader.service';
import { WindowUtilService } from '../services/window-ultil.service';

import { HyloLocation } from '../app.interface';
import { AppSetting } from '../app.setting';
import { AppGlobals } from '../services/app.global';
import { SmallLoaderService } from '../helper/small-loader/small-loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Title } from '@angular/platform-browser';

declare let google: any;

@Component({
  selector: 'home',
  providers: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public gMapStyles: any;
  public localState = {value: ''};
  public eventFilters: any[] = [];
  public eventOrders: string[];
  public selectedEventFilter: any;
  public selectedEventOrder: any;
  public events: any = [];
  public neighbourhood: HyloLocation;
  public markers: any[] = [];
  public mapZoom = 12;
  public lat = AppSetting.SingaporeLatLng.lat;
  public lng = AppSetting.SingaporeLatLng.lng;
  public priceRange: number[] = [0, 50];
  public categories: any[];
  public selected: any = 'all';
  public currentHighlightedMarker: number = 1;
  public showPrice = false;
  public showDate = false;
  public showAll = true;
  public drawCategories: any[];
  public date: { year: number, month: number };
  public options = {
    locale: {format: 'D MMMM YYYY'},
    alwaysShowCalendars: false,
  };
  public layoutWidth: number;
  public innerWidth: number;
  public loading = true;
  public showNotFound = false;

  private stopped: boolean = false;
  private zoomChanged: boolean = false;
  private loadMore: boolean = false;
  private total: any;
  private boundsChangeDefault: any = {lat: any, lng: any};
  private endRecord: boolean = false;
  private params = {
    page: 0,
    limit: 20,
    start: 0,
    tid: '',
    time: '',
    latest: '',
    when: '',
    weekend: '',
    order: '',
    type: '',
    lat: this.lat,
    long: this.lng,
    radius: 0,
    price: 0
  };
  private eventCate: any[] = [];
  private requests = [];

  constructor(private titleService: Title,
              private homeService: HomeService,
              private loaderService: LoaderService,
              private smallLoader: SmallLoaderService,
              private mapsAPILoader: MapsAPILoader,
              private localStorageService: LocalStorageService,
              private route: Router,
              private location: Location,
              private windowRef: WindowUtilService,
              public appGlobal: AppGlobals) {
  }

  public ngOnInit() {
    this.titleService.setTitle('Hylo - Discover things to do in Singapore today');
    this.appGlobal.emitActiveType('event');
    window.scroll(0, 0);
    this.eventFilters = ['all', 'today', 'tomorrow', 'this week'];
    this.eventOrders = ['top 100', 'latest'];
    this.selectedEventOrder = this.eventOrders[0];
    this.selectedEventFilter = this.eventFilters[0];
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    }
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    if (this.innerWidth <= 900) {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = false;
    } else {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = true;
    }
    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.selected = 'all';
    this.homeService.getCategories().subscribe((resp) => {
      this.drawCategories = resp.data;
      let numCategories = calculateNumCategories(this.layoutWidth);
      this.categories = this.drawCategories.slice(0, numCategories);
    });
    this.handleScroll();

    this.appGlobal.toggleMap = true;
    this.getTrendingEvents();
    this.appGlobal.neighbourhoodStorage.subscribe((response) => {
      this.neighbourhood = response;
      if (this.params.latest) {
        this.loading = true;
        window.scroll(0, 0);
        this.getEvents(this.neighbourhood);
      }
    });
  }

  public p() {
    // hack to get rid of warning
  }

  public showAllEvents() {
    this.loading = true;
    this.clearParam();
    this.selectedEventFilter = 'all';
    this.params.time = '';
    this.getTrendingEvents();
  }

  public showTodayEvents() {
    this.markers = [];
    this.events = [];
    this.params.page = 0;
    this.selectedEventFilter = 'today';
    this.params.time = 'today';
    this.getTrendingEvents();
  }

  public showTomorrowEvents() {
    this.markers = [];
    this.events = [];
    this.params.page = 0;
    this.selectedEventFilter = 'tomorrow';
    this.params.time = 'tomorrow';
    this.getTrendingEvents();
  }

  public showThisWeekEvents() {
    this.markers = [];
    this.events = [];
    this.params.page = 0;
    this.selectedEventFilter = 'this week';
    this.params.time = 'week';
    this.getTrendingEvents();
  }

  public showTop100Events() {
    this.mapZoom = 12;
    this.selectedEventOrder = 'top 100';
    this.params.latest = '';
    this.params.page = 0;
    this.params.price = 0;
    this.params.start = 0;
    this.params.when = '0';
    this.selected = 'all';
    this.markers = [];
    this.events = [];
    this.getTrendingEvents();
  }

  public showLatestEvents() {
    this.loading = true;
    this.selectedEventOrder = 'latest';
    this.params.latest = '1';
    this.params.page = 0;
    this.params.price = 0;
    this.params.start = 0;
    this.params.when = '0';
    this.selected = 'all';
    this.markers = [];
    this.events = [];
    this.getEvents(this.neighbourhood);
  }

  public setPosition(position) {
    if (position.coords) {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.params.lat = this.lat;
      this.params.long = this.lng;
    }
  }

  public onResize(event): void {
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;
    let numCategories = calculateNumCategories(this.layoutWidth);
    this.categories = this.drawCategories.slice(0, numCategories);
  }

  public onSelectEventType(event): void {
    if (event === 'all') {
      this.selected = 'all';
      this.params.tid = '';
      this.categories.forEach((category, index) => {
        this.categories[index].selected = false;
      });
    } else {
      if (event.selected) {
        event.selected = false;
        let index = this.eventCate.indexOf(event.tid);
        this.eventCate.splice(index, 1);
      } else {
        event.selected = true;
        this.eventCate.push(event.tid);
      }
      this.selected = event.tid;
      this.params.tid = this.eventCate.join(',');
    }
    this.markers = [];
    this.events = [];
    this.params.page = 0;
    this.smallLoader.show();
    this.getTrendingEvents();
  }

  public onClearForm(): void {
    this.selectedEventFilter = this.eventFilters[0];
    this.markers = [];
    this.events = [];
    this.categories.forEach((category, index) => {
      this.categories[index].selected = false;
    });
    this.eventCate = [];
    this.priceRange = [0, 50];
    this.showDate = false;
    this.showPrice = false;
    this.params.limit = 20;
    this.params.start = 0;
    this.params.page = 0;
    this.params.tid = '';
    this.params.time = '';
    this.params.price = 0;
    this.params.order = '';
    this.params.when = '';
    this.selected = 'all';
    this.getTrendingEvents();
  }

  public onLikeEmit(item: any) {
    item.user_bookmark = !item.user_bookmark;
    let user = this.localStorageService.get('user');
    if (!user) {
      this.route.navigate(['login'], {skipLocationChange: true}).then();
      return;
    }
    let param = {
      slug: item.alias
    };
    this.smallLoader.show();
    this.homeService.likeEvent(param).map((res) => res.json()).subscribe(() => {
      this.loaderService.hide();
    }, (err) => {
      if (err.status === 403) {
        this.loaderService.hide();
        this.route.navigate(['login']).then();
      } else {
        this.smallLoader.hide();
      }
    });
  }

  public clickedMarker(marker) {
    const markerSelector = $('#v' + marker.nid);
    if (markerSelector.length) {
      $('html, body').animate({
        scrollTop: markerSelector.offset().top - 80
      });
    }
    this.stopped = true;
    this.currentHighlightedMarker = marker.nid;
    this.highlightMarker(marker.nid);
  }

  public selectedDate(value: any) {
    this.markers = [];
    this.events = [];
    this.params.page = 0;
    this.params.when = [moment(value.start).format('YYYY-MM-DD'), moment(value.end).format('YYYY-MM-DD')].toString();
    this.smallLoader.show();
    this.getTrendingEvents();
  }

  public showAllCategory(e) {
    if (e) {
      this.showAll = false;
      this.categories = this.drawCategories;
    } else {
      this.showAll = true;
      let numCategories = calculateNumCategories(this.layoutWidth);
      this.categories = this.drawCategories.slice(0, numCategories);
    }
  }

  public onChangePrice(value) {
    this.markers = [];
    this.events = [];
    this.params.page = 0;
    this.priceRange = value;
    this.params.price = value.join(',');
    this.params.type = 'event';
    this.smallLoader.show();
    this.getTrendingEvents();
  }

  public showRagePrice(showPrice) {
    if (showPrice) {
      this.showPrice = false;
      this.showDate = false;
    } else {
      this.showPrice = true;
      this.showDate = false;
    }

  }

  public showWhen(showDate) {
    if (showDate) {
      this.showDate = false;
      this.showPrice = false;
    } else {
      this.showDate = true;
      this.showPrice = false;
    }
  }

  public centerChange(event) {
    this.lat = event.lat;
    this.lng = event.lng;
    this.zoomChanged = false;
  }

  public boundsChange(event) {
    this.boundsChangeDefault.lat = event.getNorthEast().lat();
    this.boundsChangeDefault.lng = event.getNorthEast().lng();
    if (this.selectedEventOrder === 'latest') {
      if (!this.zoomChanged) {
        this.mapsAPILoader.load().then(() => {
          let latLngNew = new google.maps.Marker({
            position: new google.maps.LatLng(event.getNorthEast().lat(), event.getNorthEast().lng()),
            draggable: true
          });
          // map change sleep call api
          let mapCenter = new google.maps.Marker({
            position: new google.maps.LatLng(this.lat, this.lng),
            draggable: true
          });
          let searchCenter = mapCenter.getPosition();
          let distance: any = getDistance(searchCenter, latLngNew.getPosition());
          this.zoomChanged = true;
          this.params.lat = this.lat;
          this.params.long = this.lng;
          if (this.params.radius < 0.25) {
            this.params.radius = parseFloat((distance / 1000).toFixed(2));
          } else {
            this.params.radius = parseFloat((distance / 1000).toFixed(2)) - 0.25;
          }
          this.events = [];
          this.markers = [];
          this.showNotFound = false;
          this.params.page = 0;
          this.getLatestEvents(this.params);
        });
      }
    }
  }

  private clearParam() {
    this.selectedEventFilter = this.eventFilters[0];
    this.markers = [];
    this.events = [];
    this.priceRange = [0, 50];
    this.selected = false;
    this.showDate = false;
    this.showPrice = false;
    this.params.limit = 20;
    this.params.page = 0;
    this.params.tid = '';
    this.params.time = '';
    this.params.weekend = '';
    this.params.price = 0;
    this.params.order = '';
    this.selected = 'all';
    this.mapZoom = 12;
  }

  private getTrendingEvents() {
    if (this.selectedEventOrder === 'top 100') {
      this.params.lat = 0;
      this.params.long = 0;
      this.getTop100Events(this.params);
    } else {
      this.getLatestEvents(this.params);
    }
  }

  private highlightMarker(markerId: number): void {
    this.markers.forEach((marker, index) => {
      if (marker.nid === markerId) {
        this.markers[index].opacity = 1;
        this.markers[index].isOpenInfo = true;
      } else {
        this.markers[index].opacity = 0.4;
        this.markers[index].isOpenInfo = false;
      }
    });
  }

  private handleScroll() {
    let paramsUrl = this.location.path().split('/');
    $('body').bind('DOMMouseScroll mousewheel touchmove', () => {
      $(window).scroll(() => {
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
          if (this.selectedEventOrder === 'top 100') {
            if (this.loadMore === false && this.endRecord === false) {
              if (this.events.length > 10) {
                this.loadMore = true;
                this.params.start += 20;
                this.getTrendingEvents();
              }
            }
          } else {
            if (this.loadMore === false && this.endRecord === false) {
              this.loadMore = true;
              this.smallLoader.show();
              this.params.page++;
              this.getTrendingEvents();
            }
          }
        }
        if (this.stopped) {
          return false;
        }
        let scrollElements = $('#v-scrollable');
        if (paramsUrl[1] === 'home' && scrollElements.length) {
          let baseHeight = scrollElements[0].clientHeight;
          let realScrollTop = $(window).scrollTop() + baseHeight;
          let currentHeight: number = baseHeight;
          let contentElement = scrollElements[0].children;
          if (contentElement.length > 1) {
            for (let i = 0; i < contentElement.length; i++) {
              let currentClientH = contentElement[i].clientHeight;
              currentHeight += currentClientH;
              if (realScrollTop <= currentHeight && currentHeight - currentClientH <= realScrollTop) {
                if (this.currentHighlightedMarker !== i) {
                  this.currentHighlightedMarker = i;
                  this.highlightMarker(i);
                }
              }
            }
          }
        }
      });
    });
  }

  private getTop100Events(params) {
    this.loading = true;
    this.smallLoader.show();
    this.homeService.getTop100(params).subscribe(
      (resp) => {
        this.total = resp.total;

        if (resp.data.length === 0) {
          this.endRecord = true;
        }
        if (this.loadMore) {
          this.events = this.events.concat(resp.data);
        } else {
          this.events = resp.data;
        }
        this.initMap(resp.data);
        this.loadMore = false;
        this.smallLoader.hide();
        this.loading = false;
      }
    );
  }

  private getLatestEvents(params) {
    this.smallLoader.show();
    if (this.requests.length) {
      this.requests.forEach((req) => {
        req.unsubscribe();
      });
      this.requests = [];
    }
    const request = this.homeService.getLatestEvents(params).subscribe(
      (data: any) => {
        this.events = this.loadMore ? this.events.concat(data.data) : data.data;
        this.showNotFound = data.total === 0;
        this.endRecord = data.data.length === 0;
        this.total = data.total;
        this.initMap(data.data);
        this.loadMore = false;
        this.smallLoader.hide();
        this.loading = false;
      }
    );
    this.requests.push(request);
  }

  private getEvents(neighbourhood) {
    this.loading = true;
    if (neighbourhood.name !== 'Singapore') {
      this.mapZoom = 15;
    } else {
      this.mapZoom = 12;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    }
    this.lat = neighbourhood.lat;
    this.lng = neighbourhood.lng;
    this.mapsAPILoader.load().then(() => {
      let latLngNew = new google.maps.Marker({
        position: new google.maps.LatLng(this.boundsChangeDefault.lat, this.boundsChangeDefault.lng),
        draggable: true
      });
      let mapCenter = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat, this.lng),
        draggable: true
      });
      let searchCenter = mapCenter.getPosition();
      let distance: any = getDistance(latLngNew.getPosition(), searchCenter);
      this.zoomChanged = true;
      this.params.lat = this.lat;
      this.params.long = this.lng;
      this.params.page = 0;
      this.params.radius = parseFloat((distance / 1000).toFixed(2));
      this.getLatestEvents(this.params);
    });
  }

  private initMap(events) {
    this.currentHighlightedMarker = 0;

    let mapCenter = new google.maps.Marker({
      position: new google.maps.LatLng(this.lat, this.lng),
      draggable: true
    });
    let searchCenter = mapCenter.getPosition();

    this.mapsAPILoader.load().then(
      () => {
        for (let i = 0; i < events.length; i++) {
          let latitude: any;
          let longitude: any;

          if (events[i].type === 'event') {
            if (typeof events[i].field_location_place.field_latitude !== null) {
              latitude = events[i].field_location_place.field_latitude;
            }

            if (typeof events[i].field_location_place.field_longitude !== null) {
              longitude = events[i].field_location_place.field_longitude;
            }
          }

          if (events[i].type === 'article') {
            if (events[i].field_location_place.length > 0) {

              if (typeof events[i].field_location_place[0].field_latitude !== null) {
                latitude = events[i].field_location_place[0].field_latitude;
              }

              if (typeof events[i].field_location_place[0].field_longitude !== null) {
                longitude = events[i].field_location_place[0].field_longitude;
              }
            }
          }

          let latLngDistance = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            draggable: true
          });
          let distance = getDistance(latLngDistance.getPosition(), searchCenter);
          this.events[i].distance = (distance / 1000).toFixed(1);

          // set icon for marker based on event type
          let eventMarkerIcon = 'assets/icon/locationmarker.png';
          this.appGlobal.eventIcon.forEach((icon) => {
            if (events[i].field_categories.name) {
              if (events[i].field_categories.name.toLocaleLowerCase() === icon.name) {
                eventMarkerIcon = icon.url;
              }
            }
          });

          let marker = {
            lat: latitude,
            lng: longitude,
            label: events[i].title,
            isOpenInfo: false,
            nid: events[i].nid,
            avatar: events[i].field_images[0],
            link: events[i].alias,
            icon: eventMarkerIcon,
            opacity: 0.4,
            price: [],
            nids: [],
            created: events[i].created || 0,
            events: [],
            field_event_option: events[i].field_event_option,
            type: events[i].type
          };

          if (i === 0) {
            marker.opacity = 1;
          }

          if (events[i].field_event_option.field_price) {
            marker.price = events[i].field_event_option.field_price;
          }

          this.markers.push(marker);
        }

        // put all events has the same location together in one marker
        for (let i = 0, len = this.markers.length; i < len; i++) {
          for (let j = i + 1, length = this.markers.length; j < length; j++) {
            const markerI = this.markers[i];
            const markerJ = this.markers[j];

            if (markerI && markerJ) {
              const cond = markerI.lat === markerJ.lat && markerI.lng === markerJ.lng && markerI.nids.indexOf(markerJ.nid);

              if (cond) {
                this.markers[i].events.push(this.markers[j]);
                this.markers[i].nids.push(this.markers[j].nid);
                this.markers.splice(j, 1);
              }
            }

          }
        }

        this.zoomChanged = false;
      }
    );
  }
}

function rad(x) {
  return x * Math.PI / 180;
}

function getDistance(p1, p2) {
  let R = 6378137; // Earth’s mean radius in meter
  let dLat = rad(p2.lat() - p1.lat());
  let dLong = rad(p2.lng() - p1.lng());
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateNumCategories(layoutWidth): number {
  let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  let numCategories: number;
  let containerWidth: number;
  let categoryWidth = 80;
  const borderWidth = 15;
  let dotWidth = 45;
  if (screenWidth > 992) {
    dotWidth = 60;
    containerWidth = layoutWidth - borderWidth - dotWidth;
  } else {
    containerWidth = screenWidth - borderWidth - dotWidth;
  }
  numCategories = Math.floor(containerWidth / categoryWidth) - 1;
  return numCategories;
}
