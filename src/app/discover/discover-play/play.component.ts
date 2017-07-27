import {
  Component, OnInit, ViewEncapsulation,
  EventEmitter, Output, Inject
} from '@angular/core';

import $ from 'jquery';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModeService } from '../../services/mode.service';
import { MapsAPILoader } from 'angular2-google-maps/core/services/maps-api-loader/maps-api-loader';
import { LoaderService } from '../../helper/loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSetting } from '../../app.setting';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import { DOCUMENT, Title } from '@angular/platform-browser';
import { LocalStorageService } from 'angular-2-local-storage';
import { WindowUtilService } from '../../services/window-ultil.service';

declare let google: any;

@Component({
  moduleId: 'hylo-play',
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbRatingConfig],
})

export class PlayComponent implements OnInit {
  @Output('onScrollToBottom') public onScrollToBottom = new EventEmitter<any>();

  public markers: any = [];
  public categories: any = [];
  public categoriesDraw: any[];
  public priceRange: number[] = [0, 50];
  public filterCategory: FormGroup;
  public items = [];
  public filterData: any = [];
  public currentHighlightedMarker: number = 1;
  public currentRate:any =[];
  private cuisine: any;
  public best: any = [];
  public type: any = [];
  public mapZoom: number = 12;
  public lat: number = 1.359;
  public lng: number = 103.818;
  public currentRadius: any = 5000;
  private catParam = {mode_type: ''};
  private total: number = 0;
  public showAll: boolean = true;
  public showTab: boolean = true;
  public alertType: any = '';
  public msgContent: any = '';
  public showCircle: boolean = true;
  public gMapStyles: any;
  public sortPlace: string = 'all';
  private loadMore: boolean = false;
  private end_record: boolean = false;
  public circleDraggable: boolean = false;
  public screenWidth: number = 0;
  public screenHeight: number = 0;
  public totalCuisine: number = 0;
  public layoutWidth: number;
  public innerWidth: number;
  private stopped: boolean = false;
  public rateData:any=[{star:1},{star:2},{star:3},{star:4},{star:5}];
  public shownotfound: boolean = false;
  private params = {
    type: 'play',
    kind: '',
    price: '',
    activity: '',
    cuisine: '',
    rate: 0,
    bestfor: '',
    types: '',
    order_by: 'Company_Name',
    order_dir: 'ASC',
    lat: this.lat,
    long: this.lng,
    radius: 0,
    page: 1,
    limit: 20
  };

  private zoomChanged: boolean = false;
  private boundsChangeDefault = {lat:'', lng:''};

  public sortBy: any;

  public constructor(private titleService: Title,
                     private formBuilder: FormBuilder,
                     private modeService: ModeService,
                     private rateConfig: NgbRatingConfig,
                     private mapsAPILoader: MapsAPILoader,
                     private loaderService: LoaderService,
                     private smallLoader: SmallLoaderService,
                     private route: ActivatedRoute,
                     private router: Router,
                     private location: Location,
                     private localStorageService: LocalStorageService,
                     private windowRef: WindowUtilService,
                     @Inject(DOCUMENT) private document: Document) {

    this.filterCategory = this.formBuilder.group({
      filterCategory: 'all'
    });
    //console.log(this.is)
    this.sortBy = [
      {id: 'all', name: 'Sort By'},
      {id: 'ratings', name: 'Ratings'},
      {id: 'reviews', name: 'Number of reviews'},
      {id: 'views', name: 'Popularity (Pageviews)'},
      {id: 'favorites', name: 'Number of favorites'},
      {id: 'distance', name: 'Distance (KM)'}
    ];
    this.rateConfig.max = 5;
    this.rateConfig.readonly = false;

    this.route.params.subscribe((param) => {
      if (param.location) {
        this.items = [];
        this.markers = [];
        this.mapsAPILoader.load().then(() => {
          if (param.location.replace('+', ' ') != 'Singapore') {
            let geocoder = new google.maps.Geocoder();
            if (geocoder) {
              geocoder.geocode({
                address: param.location.replace('+', ' ') + ' Xinh-ga-po',
                region: 'sg'
              }, (response, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                  if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                    this.lat = response[0].geometry.location.lat();
                    this.lng = response[0].geometry.location.lng();
                    this.params.lat = response[0].geometry.location.lat();
                    this.params.long = response[0].geometry.location.lng();
                    //ddd
                    let latLngNew = new google.maps.Marker({
                      position: new google.maps.LatLng(this.boundsChangeDefault.lat, this.boundsChangeDefault.lng),
                      draggable: true
                    });
                    //sleep change map call api
                    this.zoomChanged = true;
                    let mapCenter = new google.maps.Marker({
                      position: new google.maps.LatLng(this.lat, this.lng),
                      draggable: true
                    });
                    let searchCenter = mapCenter.getPosition();
                    let distance = this.getDistance(latLngNew.getPosition(), searchCenter);
                    this.params.lat = this.lat;
                    this.params.long = this.lng;
                    this.params.page=0;
                    this.params.radius = Math.round(distance / 1000);


                    this.mapZoom=15;
                    this.smallLoader.show();
                    this.getDataModes();
                  }
                } else {

                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
                  }
                }
              });
            }
          } else {
            this.lat = 1.359;
            this.lng = 103.818;
            this.params.lat = this.lat;
            this.params.long = this.lng;
            this.smallLoader.show();
            this.getDataModes();
          }

        });

      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
        }

      }
    });
  }

  public ngOnInit() {
    this.titleService.setTitle('Hylo - Discover things to do in Singapore today');
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.getCategories('play');
    this.getFilter();
    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    this.screenWidth = width;
    this.screenHeight = height;

    let paramsUrl = this.location.path().split('/');
    $('body').bind('DOMMouseScroll mousewheel touchmove', () => {
      $(window).scroll(() => {
        //load more data
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
          if (this.loadMore == false && this.end_record == false) {
            this.loadMore = true;
            this.params.page = this.params.page + 1;
            this.getDataModes();
          }

        }

        if (this.stopped) {
          return true;
        }
        //index marker Highlight
        if (paramsUrl[1] == 'discover' && $('#v-scrollable').length) {

          let baseHeight = $('#v-scrollable')[0].clientHeight;
          let realScrollTop = $(window).scrollTop() + baseHeight;
          let currentHeight: number = baseHeight;
          let content_element = $('#v-scrollable')[0].children;
          if (content_element.length > 1) {
            for (let i = 0; i < content_element.length; i++) {
              let currentClientH = content_element[i].clientHeight;
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
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 181) / 2;
  }

  public onResize(event): void {
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 181) / 2;

    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    this.screenWidth = width;
    this.screenHeight = height;

    let menuWidth = document.getElementById('btnHeadFilter').offsetWidth;

    let number = Math.floor(menuWidth / 55) - 1;

    if (this.screenWidth <= 768) {
      if (this.categoriesDraw.length > number) {

        this.categories = this.categoriesDraw.slice(0, number - 1);
      } else {

        this.categories = this.categoriesDraw;
      }
    } else {
      if (this.categoriesDraw.length > number) {
        this.categories = this.categoriesDraw.slice(0, 6);
      } else {
        this.categories = this.categoriesDraw.slice(0, 6);
      }
    }
  }

  setPosition(position) {
    if (position.coords) {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.params.lat = this.lat;
      this.params.long = this.lng;
      this.getDataModes();
    }

  }

  getDataModes() {
    let params = this.params;
    console.log(params);
    this.modeService.getModes(params).map((resp) => resp.json()).subscribe((resp) => {
      this.loadMore = false;
      this.total = resp.total;

      if (resp.total === 0) {
        this.shownotfound = true;
      }else{
        this.shownotfound = false;
      }
      if (resp.company.length == 0) {
        this.end_record = true;
      }
      this.initMap(resp.company);
      this.loaderService.hide();
      this.smallLoader.hide();

    }, (err) => {
      this.loadMore = false;
      this.end_record = false;
      this.items = [];
      this.markers = [];
      this.loaderService.hide();
      this.smallLoader.hide();
    });
  }
  private categorySelected:any[]=[];
  private catList:any[]=[];
  changeCategory(event,item) {
    if(event){
      if(item){
        item.checked=true;
        this.categorySelected.push(item.name);

      }
    }else{
      item.checked=false;
      let index = this.categorySelected.indexOf(item.name);
      this.categorySelected.splice(index, 1);
    }

    this.params.limit = 20;
    this.params.page = 0;
    this.markers = [];
    this.items = [];
    this.params.kind=this.categorySelected.join(',');
    this.smallLoader.show();
    this.getDataModes();
  }

  getCategories(value) {
    if (value == 'play' || value == 'eat') {
      this.catParam.mode_type = 'mode_' + value;
    } else {
      this.catParam.mode_type = '';
    }
    let params = this.catParam;
    this.modeService.getCategories(params).map((resp) => resp.json()).subscribe((resp) => {
      this.categoriesDraw = resp.data;
      let menuWidth = document.getElementById('btnHeadFilter').offsetWidth;

      let number = Math.floor(menuWidth / 55) - 1;
      if (this.categoriesDraw.length > number) {
        this.categories = this.categoriesDraw.slice(0, number - 1);
      } else {
        this.categories = this.categoriesDraw.slice(0, 6);
      }
    });

  }

  getFilter() {
    this.modeService.getFilterMode().map((resp) => resp.json()).subscribe((resp) => {
        this.filterData = resp.play;
    });
  }

  public markerDragEnd($event) {
    if ($event.coords) {
      console.log('dragEnd', $event);
      //Update center map
      this.lat = $event.coords.lat;
      this.lng = $event.coords.lng;
    }
  }

  public markerRadiusChange(event) {
    let radius = parseInt(event);
    this.currentRadius = radius;
    this.params.radius = (radius / 1000);
    this.smallLoader.show();
    this.markers = [];
    this.items = [];
    this.params.page = 0;
    this.end_record = false;
    this.getDataModes();
  }

  private initMap(companies: any) {
    if (companies) {
      this.currentHighlightedMarker = 0;
      this.mapsAPILoader.load().then(() => {
        for (let i = 0; i < companies.length; i++) {
          if (typeof companies[i].YP_Address !== 'undefined' || companies[i].YP_Address !== null) {

            let lat = companies[i].YP_Address[6].split('/');
            let lng = companies[i].YP_Address[5].split('/');
            let distance = companies[i]._dict_;

              if(distance) {
                companies[i].distance = (distance).toFixed(1);
              }
              this.items.push(companies[i]);
              if (i == 0) {
                this.markers.push({
                  lat: parseFloat(lat[1]),
                  lng: parseFloat(lng[1]),
                  label: companies[i].Company_Name,
                  opacity: 1,
                  isOpenInfo: false,
                  icon: 'assets/icon/locationmarker.png'
                });
              } else {
                this.markers.push({
                  lat: parseFloat(lat[1]),
                  lng: parseFloat(lng[1]),
                  label: companies[i].Company_Name,
                  opacity: 0.4,
                  isOpenInfo: false,
                  icon: 'assets/icon/locationmarker.png'
                });
              }
          }
        }
      });
    }
  }

  private getDistance(p1, p2) {
    let R = 6378137; // Earth’s mean radius in meter
    let dLat = this.rad(p2.lat() - p1.lat());
    let dLong = this.rad(p2.lng() - p1.lng());
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  }

  private rad(x) {
    return x * Math.PI / 180;
  }

  public clickedMarker(markerId, horizontal) {
    this.currentHighlightedMarker = markerId;
    this.highlightMarker(markerId);
    this.stopped = true;
    $('html, body').animate({
      scrollTop: $('#v' + markerId).offset().top - 80
    }, 'slow');

  }

  public navIsFixed: boolean = false;

  private highlightMarker(markerId: number): void {
    if (this.markers[markerId]) {
      this.markers.forEach((marker, index) => {
        if (index === markerId) {
          this.markers[index].opacity = 1;
          this.markers[index].isOpenInfo = true;
        } else {
          this.markers[index].opacity = 0.4;
          this.markers[index].isOpenInfo = false;
        }
      });
    }

  }

  public filterSubmit() {
    let cuisine = new Array();
    let best = new Array();
    let type = new Array();
    let rate:any=[];
    if (this.cuisine) {
      for (let j = 0; j < this.cuisine.length; j++) {
        cuisine.push(this.cuisine[j].name);
        if (this.cuisine[j].sub) {
          for (let i = 0; i < this.cuisine[j].sub.length; i++) {
            if (this.cuisine[j].sub[i].checked) {
              cuisine.push(this.cuisine[j].sub[i].name);
            }
          }
        }
      }
    }
    if (this.best) {
      for (let b of this.best) {
        best.push(b.name);
      }
    }

    if (this.type) {
      for (let t of this.type) {
        type.push(t.name);
      }
    }
    if (this.currentRate) {
      for (let r of this.currentRate) {
        rate.push(r.star);
      }
    }
    if (this.showPrice) {
      this.params.price = this.priceRange.join(',');
    }
    if (this.showCuisine) {
        this.params.activity = cuisine.join(',');
    }
    if (this.showBest) {
      this.params.bestfor = best.join(',');
    }
    if (this.showRate) {
      this.params.rate = rate.join(',');
    }
    if (this.type) {
      this.params.kind = type.join(',');
    }
    this.markers = [];
    this.items = [];
    this.params.page = 0;
    this.smallLoader.show();
    this.getDataModes();
  }

  public filterCancel() {
    this.filterCategory.value.filterCategory = 'all';
    this.smallLoader.show();
    this.clearParams();
    this.getDataModes();

  }

  public showAllKind(e) {
    if (e) {
      this.categories = this.categoriesDraw;
      this.showAll = false;
    } else {
      let menuWidth = document.getElementById('btnHeadFilter').offsetWidth;

      let number = Math.floor(menuWidth / 55) - 1;
      if (this.screenWidth <= 768) {
        if (this.categoriesDraw.length > number) {
          this.categories = this.categoriesDraw.slice(0, number - 1);
        } else {
          this.categories = this.categoriesDraw;
        }
      } else {
        if (this.categoriesDraw.length > number) {
          this.categories = this.categoriesDraw.slice(0, 6);
        } else {
          this.categories = this.categoriesDraw.slice(0, 6);
        }
      }
      this.showAll = true;
    }
  }

  public onLikeEmit(item: any) {
    if (!this.localStorageService.get('user')) {
      this.router.navigate(['login']).then();
      return;
    }
    item.is_favorite = !item.is_favorite;
    this.modeService.favoritePlace(item.Ids_No).subscribe(
      (resp) => {
        console.log(resp);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public showAllType(e) {
    this.showTab = !e;
  }

  public showPrice: boolean = false;
  public showCuisine: boolean = false;
  public showRate: boolean = false;
  public showBest: boolean = false;
  public showType: boolean = false;

  public showRagePriceFind(e) {
    if (e) {
      this.showPrice = false;
    } else {
      this.showPrice = true;
    }
    this.showCuisine = false;
    this.showRate = false;
    this.showBest = false;
    this.showType = false;
  }

  public showCuisineFind(e) {
    if (e) {
      this.showCuisine = false;
    } else {
      this.showCuisine = true;
    }
    this.showPrice = false;
    this.showRate = false;
    this.showBest = false;
    this.showType = false;
  }

  public showRateFind(e) {
    if (e) {
      this.showRate = false;
    } else {
      this.showRate = true;
    }

    this.showPrice = false;
    this.showCuisine = false;
    this.showBest = false;
    this.showType = false;
  }

  public showBestFind(e) {
    if (e) {
      this.showBest = false;
    } else {
      this.showBest = true;
    }

    this.showPrice = false;
    this.showCuisine = false;
    this.showRate = false;
    this.showType = false;

  }

  public showTypeFind(e) {
    if (e) {
      this.showType = false;
    } else {
      this.showType = true;
    }
    this.showPrice = false;
    this.showCuisine = false;
    this.showRate = false;
    this.showBest = false;
  }

  public onScrollDown(event) {
    let elm = event.srcElement;
    if (elm.clientHeight + elm.scrollTop === elm.scrollHeight) {
      this.onScrollToBottom.emit(null);
    }
  }

  public changeSort() {

    if (this.sortPlace == 'ratings') {
      this.params.order_by = 'ratings';
      this.params.order_dir = 'DESC';
    }
    if (this.sortPlace == 'reviews') {
      this.params.order_by = 'reviews';
      this.params.order_dir = 'DESC';
    }
    if (this.sortPlace == 'favorites') {
      this.params.order_by = 'favorites';
      this.params.order_dir = 'DESC';
    }
    if (this.sortPlace == 'views') {
      this.params.order_by = 'views';
      this.params.order_dir = 'DESC';
    }
    if (this.sortPlace == 'distance') {
      this.params.order_by = 'distance';
      this.params.order_dir = 'DESC';
    }
    if (this.sortPlace == 'all') {
      this.params.order_by = 'Company_Name';
      this.params.order_dir = 'DESC';
    }
    this.params.page = 0;
    this.items = [];
    this.markers = [];
    this.smallLoader.show();
    this.getDataModes();

  }

  public clearAllFilter() {
    this.clearParams();
    this.sortPlace = 'all';
    this.totalCuisine = 0;
    this.smallLoader.show();
    this.getDataModes();
  }

  private clearParams() {
    if (this.cuisine) {
      for (let i = 0; i < this.cuisine.length; i++) {
        this.cuisine[i].checked = false;
        if (this.cuisine[i].sub) {
          for (let j = 0; j < this.cuisine[i].sub.length; j++) {
            this.cuisine[i].sub[j].checked = false;
          }
        }
      }
    }
    if (this.best) {
      for (let i = 0; i < this.best.length; i++) {
        this.best[i].checked = false;
        if (this.best[i].sub) {
          for (let j = 0; j < this.best[i].sub.length; j++) {
            this.best[i].sub[j].checked = false;
          }
        }
      }
    }

    if (this.type) {
      for (let i = 0; i < this.type.length; i++) {
        this.type[i].checked = false;
        if (this.type[i].sub) {
          for (let j = 0; j < this.type[i].sub.length; j++) {
            this.type[i].sub[j].checked = false;
          }
        }
      }
    }

    this.cuisine = [];
    this.best = [];
    this.type = 'play';
    this.totalCuisine = 0;
    this.cuisineDraw = [];
    this.currentRate = [];
    this.priceRange = [0, 50];
    this.params.cuisine = '';
    this.params.price = '';
    this.params.bestfor = '';
    this.params.type = 'play';
    this.params.limit = 20;
    this.params.page = 0;
    this.params.rate = 0;
    this.params.order_by = 'Company_Name';
    this.params.order_dir = 'DESC';
    this.markers = [];
    this.items = [];
  }

  private cuisineDraw = [];

  public selectCheckBox(event, parent, sub) {
      if(sub && event){
          if(parent.sub.length > 0){
              for(let i = 0; i < parent.sub.length; i ++){
                  if(parent.sub[i].name == sub.name){
                      parent.sub[i].checked=1;
                  }
              }
          }
          parent.checked = 1;
          if(this.cuisineDraw.length > 0){
              let existArr=$.grep(this.cuisineDraw, function(obj) {
                  return obj.name == parent.name;
              });
              if(existArr.length ==0){
                  this.cuisineDraw.push(parent);
              }
          }else {
              this.cuisineDraw.push(parent);
          }
      }
      if(event && !sub){
          parent.checked =1;
          if(parent.sub){
              for(let i = 0 ;i < parent.sub.length; i ++){
                  parent.sub[i].checked=1;
              }
          }
          this.cuisineDraw.push(parent);
      }
      if(!event && parent && !sub){
          for(let i = 0 ;i < parent.sub.length; i ++){
              parent.sub[i].checked=0;
          }
          parent.checked =0;
          this.cuisineDraw = this.cuisineDraw.filter((el)=>{
              return el.name !== parent.name;
          })
      }
      if(!event && parent && sub){
          for(let i = 0 ; i < parent.sub.length; i ++){
              if(parent.sub[i].name == sub.name){
                  parent.sub[i].checked=0;
              }
          }

      }

      let totalCuisine = [];
      this.cuisine = this.cuisineDraw;
      if (this.cuisine) {
          for (let j = 0; j < this.cuisine.length; j++) {
              if(this.cuisine[j].checked){
                  totalCuisine.push(this.cuisine[j].name);
                  if (this.cuisine[j].sub) {
                      for (let i = 0; i < this.cuisine[j].sub.length; i++) {
                          if (this.cuisine[j].sub[i].checked) {
                              totalCuisine.push(this.cuisine[j].sub[i].name);
                          }
                      }
                  }
              }

          }
      }
      this.totalCuisine = totalCuisine.length;
  }

  public bestChangeCheckBox(event, item) {
    //item.checked != item.checked;
    if (event) {
      item.checked = true;
      this.best.push(item);
    } else {
      item.checked = false;
      this.best.splice(this.best.length - 1, 1);
    }
  }

  public typeChangeCheckBox(event, item) {
    //item.checked != item.checked;
    if (event) {
      item.checked = true;
      this.type.push(item);
    } else {
      item.checked = false;
      this.type.splice(this.type.length - 1, 1);
    }
  }
  public rateCheckbox(event,rate){
    if (event) {
      this.currentRate.push(rate);
    } else {
      let index = this.currentRate.indexOf(rate);
      this.currentRate.splice(index, 1);
    }
  }
  public centerChange(event) {
    this.lat = event.lat;
    this.lng = event.lng;
    this.zoomChanged = false;
  }

  public boundsChange(event) {
    this.route.params.subscribe((param) => {
      if (param.location) {
        this.mapZoom=14;
      }
    });
    this.boundsChangeDefault.lat = event.getNorthEast().lat();
    this.boundsChangeDefault.lng = event.getNorthEast().lng();
    sleep(200);
    if (!this.zoomChanged) {
      let latLngNew = new google.maps.Marker({
        position: new google.maps.LatLng(event.getNorthEast().lat(), event.getNorthEast().lng()),
        draggable: true
      });

      this.zoomChanged = true;
      let mapCenter = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat, this.lng),
        draggable: true
      });
      let searchCenter = mapCenter.getPosition();
      let distance:any = this.getDistance(latLngNew.getPosition(), searchCenter);
      this.params.lat = this.lat;
      this.params.long = this.lng;
      this.params.page=0;
      this.params.radius = parseFloat((distance / 1000).toFixed(2));
      this.smallLoader.show();
      this.items = [];
      this.markers = [];
      this.getDataModes();
    }
  }
}
function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}
