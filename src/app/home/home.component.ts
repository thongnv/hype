import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment/moment';
import { Location } from '@angular/common';
import { any } from 'codelyzer/util/function';
import { MapsAPILoader } from 'angular2-google-maps/core/services/maps-api-loader/maps-api-loader';
import $ from 'jquery';

import { HomeService } from '../services/home.service';
import { LoaderService } from '../helper/loader/loader.service';

import { AppSetting } from '../app.setting';
import { SmallLoaderService } from '../helper/small-loader/small-loader.service';
import { LocalStorageService } from 'angular-2-local-storage';

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
  public alertType: any = '';
  public showPrice: boolean = false;
  public showDate: boolean = false;
  public msgContent: any = '';
  public showAll: boolean = true;
  public showCircle: boolean = false;
  public screenWidth: number = 0;
  public screenHeight: number = 0;
  public circleDraggable: boolean = true;
  public drawCategories: any[];
  public date: { year: number, month: number };
  public options: any = {
    locale: {format: 'YYYY-MM-DD'},
    alwaysShowCalendars: false,
  };

  public shownotfound: boolean = false;

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
    radius: any,
    price: ''
  };

  constructor(private homeService: HomeService,
              private loaderService: LoaderService,
              private smallLoader: SmallLoaderService,
              private mapsAPILoader: MapsAPILoader,
              private localStorageService: LocalStorageService,
              private route: Router,
              private location: Location) {
  }

  public ngOnInit() {
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

    this.loaderService.show();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    }
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.selectedEventOrder = this.eventOrder[0];
    this.selectedEventFilter = this.eventFilter[0];
    this.selected = 'all';
    this.smallLoader.hide();
    this.loaderService.hide();
    if(this.selectedEventOrder.name == 'top 100'){
      this.getTrending();
    }
    this.getTrandingCategories();

    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    this.screenWidth = width;
    this.screenHeight = height;
    this.handleScroll();
  }

  public setPosition(position) {
    if (position.coords) {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.params.lat = this.lat;
      this.params.long = this.lng;
    }
  }

  public p() {
    // TODO;
  }

  public onResize(event): void {
    console.log(event);
    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    this.screenWidth = width;
    this.screenHeight = height;

    let imageNumber = Math.floor(this.screenWidth / 55) - 1;
    if (this.screenWidth <= 768) {
      if (this.drawCategories.length > imageNumber) {
        this.categories = this.drawCategories.slice(0, imageNumber - 1);
      } else {
        this.categories = this.drawCategories;
      }
    } else {
      if (this.drawCategories.length > imageNumber) {
        this.categories = this.drawCategories.slice(0, 6);
      } else {
        if (this.screenWidth <= 1024) {
          this.categories = this.drawCategories.slice(0, 6);
        } else {
          this.categories = this.drawCategories.slice(0, 6);

        }
      }
    }
  }

  public onSelectEventType(event): void {
    if (event === 'all') {
      this.selected = 'all';
      this.params.tid = '';
    } else {
      this.selected = event.tid;
      this.params.tid = event.tid;
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
    this.params.radius = 0;
    this.params.price = '';
    this.params.order = '';
    this.selected = 'all';
    this.getTrending();
  }

  public onSelectEventFilter(filter: any): void {
    this.clearParam();
    this.selectedEventFilter = filter;
    let date = new Date();
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
      let distance = getDistance(latLngNew.getPosition(), mapCenter.getPosition());
      this.params.lat = this.lat;
      this.params.long = this.lng;
      this.params.radius = (distance / 1000).toFixed(1) - 1;
    }
    this.params.page=0;
    this.params.price=0;
    this.params.start=20;
    this.params.when=0;
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
      console.log(res);
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

  public clickedMarker(markerId, horizontal) {
    console.log(horizontal);
    $('html, body').animate({
      scrollTop: $('#v' + markerId).offset().top - 80
    });
    this.stopped = true;
    this.currentHighlightedMarker = markerId;
    this.highlightMarker(markerId);
  }

  public selectedDate(value: any) {
    this.onClearForm();
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
      let imageNumber = Math.floor(this.screenWidth / 55) - 1;
      if (this.screenWidth <= 768) {
        if (this.drawCategories.length > imageNumber) {
          this.categories = this.drawCategories.slice(0, imageNumber - 1);
        } else {
          this.categories = this.drawCategories;
        }
      } else {

        if (this.drawCategories.length > imageNumber) {
          this.categories = this.drawCategories.slice(0, 6);
        } else {
          this.categories = this.drawCategories.slice(0, 6);

        }

      }
      console.log(this.categories);
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

  public showRagePrice() {
    this.showPrice = true;
    this.showDate = false;
  }

  public showWhen() {
    this.showDate = true;
    this.showPrice = false;
  }

  public centerChange(event) {
    this.lat = event.lat;
    this.lng = event.lng;
    this.zoomChanged = false;
  }

  public boundsChange(event) {
    this.boundsChangeDefault.lat = event.getNorthEast().lat();
    this.boundsChangeDefault.lng = event.getNorthEast().lng();
    if (!this.zoomChanged && this.selectedEventOrder.name !== 'top 100') {
      let latLngNew = new google.maps.Marker({
        position: new google.maps.LatLng(event.getNorthEast().lat(), event.getNorthEast().lng()),
        draggable: true
      });
      // map change sleep call api
      this.zoomChanged = true;
      let mapCenter = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat, this.lng),
        draggable: true
      });
      let searchCenter = mapCenter.getPosition();
      let distance = getDistance(latLngNew.getPosition(), searchCenter);
      this.params.lat = this.lat;
      this.params.long = this.lng;
      this.params.radius = (distance / 1000).toFixed(1) -1;
      this.smallLoader.show();
      this.events = [];
      this.markers = [];
      this.params.page=0;
      sleep(500);
      this.getTrending();
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
  }

  private getTrending() {
    if (this.selectedEventOrder.name === 'top 100') {
      this.getTop100(this.params);
    } else {
      this.getEvents(this.params);
    }
  }

  private getTrandingCategories() {
    this.homeService.getCategories('event').map((resp) => resp.json()).subscribe((resp) => {
      this.drawCategories = resp.data;
      let imageNumber = Math.floor(this.screenWidth / 55) - 1;
      if (this.screenWidth <= 768) {
        if (resp.data.length >= imageNumber) {
          this.categories = resp.data.slice(0, imageNumber - 1);
        } else {
          this.categories = resp.data;
        }
      } else {

        if (this.drawCategories.length > imageNumber) {
          this.categories = this.drawCategories.slice(0, 6);
        } else {
          this.categories = this.drawCategories.slice(0, 6);
        }

      }

    });
  }

  private highlightMarker(markerId: number): void {
    if (this.markers[markerId]) {
      this.markers[markerId].opacity = 1;
      this.markers.forEach((marker, index) => {
        if (index === markerId) {
          console.log('markerId', markerId);
          this.markers[index].opacity = 1;
          this.markers[index].isOpenInfo = true;
        } else {
          this.markers[index].opacity = 0.4;
          this.markers[index].isOpenInfo = false;
        }
      });
    }
  }

  private passerTrending(geo: any) {
    this.markers = [];
    this.mapsAPILoader.load().then(() => {
      for (let i = 0; i < geo.length; i++) {
        for (let item of geo[i]) {
          let latlng = item.split(',');
          if (i === 0) {
            this.markers.push({
              lat: parseFloat(latlng[0]),
              lng: parseFloat(latlng[1]),
              label: '',
              opacity: 1,
              isOpenInfo: true,
              icon: 'assets/icon/locationmarker.png'
            });
          } else {
            this.markers.push({
              lat: parseFloat(latlng[0]),
              lng: parseFloat(latlng[1]),
              label: '',
              opacity: 0.4,
              isOpenInfo: false,
              icon: 'assets/icon/locationmarker.png'
            });
          }
        }
      }
    });
  }

  private passerTop100(events: any) {
    this.currentHighlightedMarker = 0;
    this.mapsAPILoader.load().then(() => {
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
          if (i === 0) {
            this.markers.push({
              lat: latitude,
              lng: longitude,
              label: events[i].title,
              opacity: 1,
              isOpenInfo: true,
              icon: 'assets/icon/locationmarker.png'
            });
          } else {
            this.markers.push({
              lat: latitude,
              lng: longitude,
              label: events[i].title,
              opacity: 0.4,
              isOpenInfo: false,
              icon: 'assets/icon/locationmarker.png'
            });
          }

        }
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
              if (this.events.length > 10) {
                this.loadMore = true;
                this.smallLoader.show();
                this.params.page++;
                this.getTrending();
              }
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
    this.homeService.getTop100(params).map((resp) => resp.json()).subscribe(
      (resp) => {
        console.log(this.events);
        this.total = resp.total;

        if (resp.total === 0) {
          this.shownotfound = true;
        }else{
          this.shownotfound = false;
        }

        if (resp.data.length === 0) {
          this.endRecord = true;
        }
        if (this.loadMore) {
          this.events = this.events.concat(resp.data);
        } else {
          this.events = resp.data;
        }
        this.passerTop100(resp.data);
        this.loadMore = false;
        this.loaderService.hide();
        this.smallLoader.hide();
        this.zoomChanged = false;
      },
      (err) => {
        console.log(err);
        this.loadMore = true;
        this.endRecord = true;
        this.events = [];
        this.total = 0;
        this.loaderService.hide();
        this.smallLoader.hide();
      });
  }

  private getEvents(params) {
    this.homeService.getEvents(params).map((response) => response.json()).subscribe(
      (response) => {
        if (this.loadMore) {
          this.events = this.events.concat(response.data);
        } else {
          this.events = response.data;
        }
        if (response.data.length === 0) {
          this.endRecord = true;
        }
        this.total = response.total;

        if (response.total === 0) {
          this.shownotfound = true;
        }else{
          this.shownotfound = false;
        }

        this.passerTrending(response.geo);
        this.loadMore = false;
        this.loaderService.hide();
        this.smallLoader.hide();
      },
      (err) => {
        console.log(err);
        this.loadMore = true;
        this.endRecord = true;
        this.loaderService.hide();
        this.smallLoader.hide();
      });
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
function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}
