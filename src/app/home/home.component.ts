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
  public eventFilter: any[] = [];
  public selectedEventFilter: any;
  public eventOrder: any[] = [];
  public selectedEventOrder: any;
  public events: any = [];
  public markers: any[] = [];
  public mapZoom: number = 12;
  public lat: number = 1.359;
  public lng: number = 103.818;
  public priceRange: number[] = [0, 50];
  public categories: any[];
  public selected: any = 'all';
  public currentHighlightedMarker: number = 1;
  public showPrice: boolean = false;
  public showDate: boolean = false;
  public showAll: boolean = true;
  public showCircle: boolean = false;
  public drawCategories: any[];
  public date: { year: number, month: number };
  public options: any = {
    locale: {format: 'D MMMM YYYY'},
    alwaysShowCalendars: false,
  };
  public shownotfound: boolean = false;
  public layoutWidth: number;
  public innerWidth: number;
  public loading = true;

  private stopped: boolean = false;
  private zoomChanged: boolean = false;
  private loadMore: boolean = false;
  private total: any;
  private boundsChangeDefault: any = {lat: any, lng: any};
  private endRecord: boolean = false;
  private params: any = {
    page: 0,
    limit: 20,
    start: 0,
    tid: '',
    time: '',
    latest: '',
    when: '',
    lat: this.lat,
    long: this.lng,
    radius: '',
    price: ''
  };
  private eventCate: any[] = [];

  private requestings = [];

  constructor(private titleService: Title,
              private homeService: HomeService,
              private loaderService: LoaderService,
              private smallLoader: SmallLoaderService,
              private mapsAPILoader: MapsAPILoader,
              private localStorageService: LocalStorageService,
              private route: Router,
              private location: Location,
              private windowRef: WindowUtilService,
              private appGlobal: AppGlobals
  ) {
    window.scroll(0, 0);
  }

  public ngOnInit() {



    this.titleService.setTitle('Hylo - Discover things to do in Singapore today');
    this.eventFilter = [
      {name: 'all'},
      {name: 'today'},
      {name: 'tomorrow'},
      {name: 'this week'},
    ];
    this.eventOrder = [
      {name: 'top 100'},
      {name: 'latest'},
    ];

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    }
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.selectedEventOrder = this.eventOrder[0];
    this.selectedEventFilter = this.eventFilter[0];
    this.selected = 'all';
    if (this.selectedEventOrder.name === 'top 100') {
      this.getTrending();
    }
    this.homeService.getCategories('event').map((resp) => resp.json()).subscribe((resp) => {
      this.drawCategories = resp.data;
      let numCategories = calculateNumCategories();
      this.categories = this.drawCategories.slice(0, numCategories);
    });

    this.handleScroll();
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;

    if(this.innerWidth <= 900){
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = false;
    }else{
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = true;
    }

    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;
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
    let numCategories = calculateNumCategories();
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
    this.getTrending();
  }

  public onClearForm(): void {
    this.selectedEventFilter = this.eventFilter[0];
    this.markers = [];
    this.events = [];
    this.categories.forEach((category, index) => {
      this.categories[index].selected = false;
    });
    this.eventCate = [];
    this.priceRange = [0, 50];
    this.selected = false;
    this.showDate = false;
    this.showPrice = false;
    this.smallLoader.show();
    this.params.limit = 20;
    this.params.start = 0;
    this.params.page = 0;
    this.params.tid = '';
    this.params.time = '';
    this.params.price = '';
    this.params.order = '';
    this.params.when = '';
    this.selected = 'all';
    this.getTrending();
  }

  public onSelectEventFilter(filter: any): void {
    this.clearParam();
    this.selectedEventFilter = filter;
    if (filter.name === 'today') {
      this.params.time = 'today';
    } else if (filter.name === 'tomorrow') {
      this.params.time = 'tomorrow';
    } else if (filter.name === 'this week') {
      this.params.time = 'week';
    } else if (filter.name === 'all') {
      this.params.time = '';
    } else {
      this.showCircle = this.selectedEventOrder.name !== 'top 100';
    }
    this.markers = [];
    this.events = [];
    this.smallLoader.show();
    this.getTrending();
  }

  public onSelectEventOrder(order: any): void {
    this.selectedEventOrder = order;
    this.mapZoom = 12;
    if (order.name === 'top 100') {
      this.params.latest = '';
    } else {
      this.params.latest = 1;
      let latLngNew = new google.maps.Marker({
        position: new google.maps.LatLng(this.boundsChangeDefault.lat, this.boundsChangeDefault.lng),
        draggable: true
      });
      this.zoomChanged = true;
      let mapCenter = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat, this.lng),
        draggable: true
      });
      let distance: any = getDistance(latLngNew.getPosition(), mapCenter.getPosition());
      this.params.lat = this.lat;
      this.params.long = this.lng;
      this.params.radius = parseFloat((distance / 1000).toFixed(2));
    }
    this.params.page = 0;
    this.params.price = 0;
    this.params.start = 0;
    this.params.when = 0;
    this.selected = 'all';
    this.markers = [];
    this.events = [];
    this.smallLoader.show();
    this.getTrending();
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
    this.homeService.likeEvent(param).map((res) => res.json()).subscribe((res) => {
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
    if ($('#v' + marker.nid).length) {
      $('html, body').animate({
        scrollTop: $('#v' + marker.nid).offset().top - 80
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
    this.params.when = [moment(value.start).format('YYYY-MM-DD'), moment(value.end).format('YYYY-MM-DD')];
    this.smallLoader.show();
    this.getTrending();
  }

  public showAllCategory(e) {
    if (e) {
      this.showAll = false;
      this.categories = this.drawCategories;
    } else {
      this.showAll = true;
      let numCategories = calculateNumCategories();
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
    this.getTrending();
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
    if (this.selectedEventOrder.name !== 'top 100') {
      if (!this.zoomChanged) {
        let latLngNew = new google.maps.Marker({
          position: new google.maps.LatLng(event.getNorthEast().lat(), event.getNorthEast().lng()),
          draggable: true
        });
        // map change sleep call api
        let mapCenter = new google.maps.Marker({
          position: new google.maps.LatLng(this.lat, this.lng),
          draggable: true
        });
        this.zoomChanged = true;
        let searchCenter = mapCenter.getPosition();
        let distance: any = getDistance(searchCenter, latLngNew.getPosition());
        this.params.lat = this.lat;
        this.params.long = this.lng;
        if (this.params.radius < 0.25) {
          this.params.radius = parseFloat((distance / 1000).toFixed(2));
        } else {
          this.params.radius = parseFloat((distance / 1000).toFixed(2)) - 0.25;
        }
        this.smallLoader.show();
        this.events = [];
        this.markers = [];
        this.params.page = 0;
        this.shownotfound = false;
        this.getTrending();
      }
    }
  }

  private clearParam() {
    this.selectedEventFilter = this.eventFilter[0];
    this.markers = [];
    this.events = [];
    this.priceRange = [0, 50];
    this.selected = false;
    this.showDate = false;
    this.showPrice = false;
    this.smallLoader.show();
    this.params.limit = 20;
    this.params.page = 0;
    this.params.tid = '';
    this.params.time = '';
    this.params.weekend = '';
    this.params.price = '';
    this.params.order = '';
    this.selected = 'all';
    this.mapZoom = 12;
  }

  private getTrending() {
    if (this.selectedEventOrder.name === 'top 100') {
      this.getTop100(this.params);
    } else {
      this.getEvents();
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

  private passerTop100() {
    this.currentHighlightedMarker = 0;

    let mapCenter = new google.maps.Marker({
      position: new google.maps.LatLng(this.lat, this.lng),
      draggable: true
    });
    let searchCenter = mapCenter.getPosition();

    this.mapsAPILoader.load().then(
      () => {
        for (let i = 0; i < this.events.length; i++) {
          let latitude: any;
          let longitude: any;

          if (this.events[i].type === 'event') {
            if (typeof this.events[i].field_location_place.field_latitude !== null) {
              latitude = this.events[i].field_location_place.field_latitude;
            }

            if (typeof this.events[i].field_location_place.field_longitude !== null) {
              longitude = this.events[i].field_location_place.field_longitude;
            }
          }

          if (this.events[i].type === 'article') {
            if (this.events[i].field_location_place.length > 0) {

              if (typeof this.events[i].field_location_place[0].field_latitude !== null) {
                latitude = this.events[i].field_location_place[0].field_latitude;
              }

              if (typeof this.events[i].field_location_place[0].field_longitude !== null) {
                longitude = this.events[i].field_location_place[0].field_longitude;
              }
            }
          }

          let latLngDistance = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            draggable: true
          });
          let distance = getDistance(latLngDistance.getPosition(), searchCenter);
          this.events[i].distance = (distance / 1000).toFixed(1);

          let marker = {
            lat: latitude,
            lng: longitude,
            label: this.events[i].title,
            isOpenInfo: true,
            nid: this.events[i].nid,
            avatar: this.events[i].field_images[0],
            link: this.events[i].alias,
            icon: 'assets/icon/locationmarker.png',
            opacity: 0.4,
            price: [],
            events: []
          };

          if (i === 0) {
            marker.opacity = 1;
          }

          if (this.events[i].field_event_option.field_price) {
            marker.price = this.events[i].field_event_option.field_price;
          }

          this.markers.push(marker);
        }

        // console.log('markers: ', this.markers);
        // put all events has the same location together in one marker
        for (let i = 0, len = this.markers.length; i < len; i++) {
          for (let j = i + 1, length = this.markers.length; j < length; j++) {
            const markerI = this.markers[i];
            const markerJ = this.markers[j];

            if (markerI && markerJ) {
              const cond = markerI.lat === markerJ.lat && markerI.lng === markerJ.lng;

              if (cond) {
                this.markers[i].events.push(this.markers[j]);
                this.markers.splice(j, 1);
              }
            }

          }
        }

        // console.log('remove duplicate markers: ', this.markers);

        sleep(50);
        this.zoomChanged = false;
      }
    );
  }

  private handleScroll() {
    let paramsUrl = this.location.path().split('/');
    $('body').bind('DOMMouseScroll mousewheel touchmove', () => {
      $(window).scroll(() => {
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
          if (this.selectedEventOrder.name === 'top 100') {
            if (this.loadMore === false && this.endRecord === false) {
              if (this.events.length > 10) {
                this.loadMore = true;
                this.params.start += 20;
                this.smallLoader.show();
                this.getTrending();
              }
            }
          } else {
            if (this.loadMore === false && this.endRecord === false) {
              this.loadMore = true;
              this.smallLoader.show();
              this.params.page++;
              this.getTrending();
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

  private getTop100(params) {
    this.loading = true;
    this.homeService.getTop100(params).map((resp) => resp.json()).subscribe(
      (resp) => {
        this.total = resp.total;

        this.shownotfound = resp.total === 0;

        if (resp.data.length === 0) {
          this.endRecord = true;
        }
        if (this.loadMore) {
          this.events = this.events.concat(resp.data);
        } else {
          this.events = resp.data;
        }
        this.passerTop100();
        this.loadMore = false;
        this.loaderService.hide();
        this.smallLoader.hide();
        this.loading = false;
      },
      (err) => {
        this.loadMore = true;
        this.endRecord = true;
        this.events = [];
        this.total = 0;
        this.loaderService.hide();
        this.smallLoader.hide();
        this.loading = false;
      });
  }

  private getEvents() {
    this.loading = true;
    if (this.requestings.length > 0) {
      this.requestings.forEach((req) => {
        req.unsubscribe();
      });
    }

    const req = this.homeService.getLatestEvents(this.params)
      .subscribe(
        (data) => {
          this.events = this.loadMore ? this.events.concat(data.data) : data.data;
          this.endRecord = data.data.length === 0;
          this.total = data.total;
          this.shownotfound = data.total === 0;

          this.passerTop100();
          this.loadMore = false;
          this.loaderService.hide();
          this.smallLoader.hide();
          this.loading = false;
        },
        (error) => {
          req.unsubscribe();

          this.loadMore = false;
          this.endRecord = false;
          this.loaderService.hide();
          this.smallLoader.hide();
          this.loading = false;
        },
        () => {
          req.unsubscribe();
        }
      );

    this.requestings.push(req);

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

function calculateNumCategories(): number {
  let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  let numCategories: number;
  let containerWidth: number;
  const categoryWidth = 76;
  const navBarWidth = 80;
  const borderWidth = 15;
  const dotWidth = 43;
  if (screenWidth > 992) {
    const containerPercentage = 0.46;
    containerWidth = (screenWidth - navBarWidth - borderWidth) * containerPercentage - dotWidth;
  } else {
    containerWidth = screenWidth - borderWidth - dotWidth;
  }
  numCategories = Math.floor(containerWidth / categoryWidth) - 1;
  return numCategories;
}
function sleep(delay) {
  let start = new Date().getTime();
  while (new Date().getTime() < start + delay) {
    // Sleep
  }
}
