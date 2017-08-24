import {
  Component, OnInit, ViewEncapsulation,
  EventEmitter, Output
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
import { AppGlobals } from '../../services/app.global';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { WindowUtilService } from '../../services/window-ultil.service';
import { Title } from '@angular/platform-browser';
import { CompanyService } from '../../services/company.service';

declare let google: any;

@Component({
  moduleId: 'hylo-mode',
  selector: 'app-mode',
  templateUrl: './eat.component.html',
  styleUrls: ['./eat.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbRatingConfig],
})

export class EatComponent implements OnInit {
  @Output('onScrollToBottom') public onScrollToBottom = new EventEmitter<any>();

  public markers: any = [];
  public categories: any = [];
  public categoriesDraw: any[];
  public priceRange: number[] = [0, 50];
  public filterCategory: FormGroup;
  public items = [];
  public filterData: any = [];
  public currentHighlightedMarker: number = 1;
  public currentRate: any = [];
  public best: any = [];
  public type: any = [];
  public mapZoom: number = 12;
  public lat: number = 1.359;
  public lng: number = 103.818;
  public showAll: boolean = true;
  public showTab: boolean = true;
  public showCircle: boolean = true;
  public gMapStyles: any;
  public screenWidth: number = 0;
  public innerWidth: number;
  public screenHeight: number = 0;
  public layoutWidth: number;
  public rateData: any = [{star: 1}, {star: 2}, {star: 3}, {star: 4}, {star: 5}];
  public shownotfound: boolean = false;
  public sortBy: any;
  public labelSort: string = 'Name';
  public totalCuisine: number = 0;
  public selected = 'all';
  public showPrice: boolean = false;
  public showCuisine: boolean = false;
  public showRate: boolean = false;
  public showBest: boolean = false;
  public showType: boolean = false;

  private loadMore: boolean = false;
  private catParam = {mode_type: ''};
  private endRecord: boolean = false;
  private cuisine: any;
  private total: number = 0;
  private stopped: boolean = false;
  private categorySelected: any[] = [];
  private requests = [];

  private params = {
    type: 'eat',
    kind: '',
    price: '',
    activity: '',
    cuisine: '',
    rate: '',
    bestfor: '',
    types: '',
    order_by: 'Company_Name',
    order_dir: 'ASC',
    lat: this.lat,
    long: this.lng,
    radius: 0,
    page: 0,
    limit: 20
  };
  private zoomChanged: boolean = false;

  private boundsChangeDefault = {lat: '', lng: ''};

  private cuisineDraw = [];

  public constructor(private titleService: Title,
                     private formBuilder: FormBuilder,
                     private modeService: ModeService,
                     private rateConfig: NgbRatingConfig,
                     private mapsAPILoader: MapsAPILoader,
                     private loaderService: LoaderService,
                     private smallLoader: SmallLoaderService,
                     private route: ActivatedRoute,
                     private router: Router,
                     private localStorageService: LocalStorageService,
                     private windowRef: WindowUtilService,
                     public appGlobal: AppGlobals,
                     private companyService: CompanyService) {
  }

  public ngOnInit() {
    window.scroll(0, 0);
    this.titleService.setTitle('Hylo - Discover things to do in Singapore today');
    this.appGlobal.emitActiveType('eat');
    this.filterCategory = this.formBuilder.group({
      filterCategory: 'all'
    });
    this.sortBy = [
      {id: 'all', name: 'Name'},
      {id: 'ratings', name: 'Ratings'},
      {id: 'reviews', name: 'Number of reviews'},
      {id: 'views', name: 'Popularity (Pageviews)'},
      {id: 'favorites', name: 'Number of favorites'},
      {id: 'distance', name: 'Distance (KM)'}
    ];
    this.rateConfig.max = 5;
    this.rateConfig.readonly = false;

    this.gMapStyles = AppSetting.GMAP_STYLE;

    this.catParam.mode_type = 'mode_eat';
    this.modeService.getCategories(this.catParam).map((resp) => resp.json()).subscribe(
      (resp) => {
        this.categoriesDraw = resp.data;
        let numCategories = calculateNumCategories();
        this.categories = this.categoriesDraw.slice(0, numCategories);
      });
    this.modeService.getFilterMode().map((resp) => resp.json()).subscribe((resp) => {
      this.filterData = resp.eat;
    });
    this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    $('body').bind('DOMMouseScroll mousewheel touchmove', () => {
      $(window).scroll(() => {
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
          if (this.loadMore === false && this.endRecord === false && this.total > 10) {
            this.loadMore = true;
            this.params.page = this.params.page + 1;
            this.getDataModes();
          }
        }

        if (this.stopped) {
          return true;
        }
        // index marker Highlight
        const contentSelector = $('#v-scrollable');
        if (contentSelector.length) {
          let baseHeight = contentSelector[0].clientHeight;
          let realScrollTop = $(window).scrollTop() + baseHeight;
          let currentHeight: number = baseHeight;
          let contentElement = contentSelector[0].children;
          if (contentElement.length > 1) {
            for (let i = 0; i < contentElement.length; i++) {
              let currentClientH = contentElement[i].clientHeight;
              currentHeight += currentClientH;
              if (realScrollTop <= currentHeight && currentHeight - currentClientH <= realScrollTop) {
                if (this.currentHighlightedMarker !== i) {
                  this.currentHighlightedMarker = i;
                  this.highlightMarker(i, 'scroll');
                }
              }
            }
          }
        }
      });
    });
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
    this.appGlobal.neighbourhoodStorage.subscribe((neighbourhood) => {
      this.getPlaces(neighbourhood);
    });
  }

  public onResize(event): void {
    console.log(event);
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;
    let numCategories = calculateNumCategories();
    this.categories = this.categoriesDraw.slice(0, numCategories);
  }

  public clickedMarker(marker) {
    this.currentHighlightedMarker = marker.index;
    this.highlightMarker(marker.index, 'click');
    this.stopped = true;
    $('html, body').animate({
      scrollTop: $('#v' + marker.index).offset().top - 80
    }, 'slow');

    // set image for info window
    marker.avatar = 'assets/img/company/default_140x140.jpg';
    this.companyService.getInstagramProfile(marker.licenseNumber).subscribe(
      (profile) => marker.avatar = profile[0] ? profile[0] : 'assets/img/company/default_140x140.jpg',
      (error) => {
        console.log(error);
      });
  }

  public changeCategory(item) {
    switch (item) {
      case 'all':
        this.categories.forEach((category, index) => {
          this.categories[index].selected = false;
        });
        this.selected = 'all';
        this.params.kind = '';
        this.categorySelected = [];
        break;
      default:
        this.selected = '';
        if (item.selected) {
          item.selected = false;
          let index = this.categorySelected.indexOf(item.name);
          this.categorySelected.splice(index, 1);
        } else {
          item.selected = true;
          this.categorySelected.push(item.name);
        }
        this.params.kind = this.categorySelected.join(',');
        break;
    }
    if (this.categorySelected.length === 0) {
      this.selected = 'all';
    }
    this.params.limit = 20;
    this.params.page = 0;
    this.markers = [];
    this.items = [];
    this.getDataModes();
  }

  public filterSubmit() {
    const cuisine = [];
    const best = [];
    const type = [];
    const rate = [];
    if (this.cuisine) {
      this.cuisine.forEach((item, j) => {
        cuisine.push(this.cuisine[j].name);
        if (this.cuisine[j].sub) {
          this.cuisine[j].sub.forEach((subItem, i) => {
            if (this.cuisine[j].sub[i].checked) {
              cuisine.push(this.cuisine[j].sub[i].name);
            }
          });
        }
      });
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
    if (this.showPrice) {
      this.params.price = this.priceRange.join(',');
    }
    if (this.showCuisine) {
      this.params.cuisine = cuisine.join(',');
    }
    if (this.showBest) {
      this.params.bestfor = best.join(',');
    }
    if (this.currentRate) {
      for (let r of this.currentRate) {
        rate.push(r.star);
      }
    }
    if (this.showRate) {
      this.params.rate = rate.join(',');
    }
    if (this.type) {
      this.params.types = type.join(',');
    }
    this.markers = [];
    this.items = [];
    this.params.page = 0;
    this.getDataModes();
  }

  public filterCancel() {
    this.filterCategory.value.filterCategory = 'all';
    this.clearParams();
    this.getDataModes();

  }

  public showAllCategories(e) {
    if (e) {
      this.showAll = false;
      this.categories = this.categoriesDraw;
    } else {
      this.showAll = true;
      let numCategories = calculateNumCategories();
      this.categories = this.categoriesDraw.slice(0, numCategories);
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

  public showRagePriceFind(e) {
    this.showPrice = !e;
    this.showCuisine = false;
    this.showRate = false;
    this.showBest = false;
    this.showType = false;
  }

  public showCuisineFind(e) {
    this.showCuisine = !e;
    this.showPrice = false;
    this.showRate = false;
    this.showBest = false;
    this.showType = false;
  }

  public showRateFind(e) {
    this.showRate = !e;

    this.showPrice = false;
    this.showCuisine = false;
    this.showBest = false;
    this.showType = false;
  }

  public showBestFind(e) {
    this.showBest = !e;

    this.showPrice = false;
    this.showCuisine = false;
    this.showRate = false;
    this.showType = false;

  }

  public showTypeFind(e) {
    this.showType = !e;
    this.showPrice = false;
    this.showCuisine = false;
    this.showRate = false;
    this.showBest = false;
  }

  public changeSort(id, label) {
    console.log(id);
    this.labelSort = label;
    if (id === 'ratings') {
      this.params.order_by = 'ratings';
      this.params.order_dir = 'DESC';
    }
    if (id === 'reviews') {
      this.params.order_by = 'reviews';
      this.params.order_dir = 'DESC';
    }
    if (id === 'favorites') {
      this.params.order_by = 'favorites';
      this.params.order_dir = 'DESC';
    }
    if (id === 'views') {
      this.params.order_by = 'views';
      this.params.order_dir = 'DESC';
    }
    if (id === 'distance') {
      this.params.order_by = 'distance';
      this.params.order_dir = 'DESC';
    }
    if (id === 'all') {
      this.params.order_by = 'Company_Name';
      this.params.order_dir = 'ASC';
    }
    this.params.page = 0;
    this.items = [];
    this.markers = [];
    this.getDataModes();

  }

  public clearAllFilter() {
    this.clearParams();
    this.labelSort = 'Name';
    this.totalCuisine = 0;
    this.showCuisine = false;
    this.showPrice = false;
    this.showRate = false;
    this.showBest = false;
    this.showType = false;
    this.getDataModes();
  }

  public selectCheckBox(event, parent, sub) {
    if (sub && event) {
      if (parent.sub.length > 0) {
        parent.sub.forEach((item, i) => {
          if (parent.sub[i].name === sub.name) {
            parent.sub[i].checked = 1;
          }
        });
      }
      parent.checked = 1;
      if (this.cuisineDraw.length > 0) {
        let existArr = $.grep(this.cuisineDraw, (obj) => {
          return obj.name === parent.name;
        });
        if (existArr.length === 0) {
          this.cuisineDraw.push(parent);
        }
      } else {
        this.cuisineDraw.push(parent);
      }
    }
    if (event && !sub) {
      parent.checked = 1;
      if (parent.sub) {
        parent.sub.forEach((item, i) => {
          parent.sub[i].checked = 1;
        });
      }
      this.cuisineDraw.push(parent);
    }

    if (!event && parent && !sub) {
      if (parent.sub) {
        parent.sub.forEach((item, i) => {
          parent.sub[i].checked = 0;
        });
      }
      parent.checked = 0;
      this.cuisineDraw = this.cuisineDraw.filter((el) => {
        return el.name !== parent.name;
      });
    }
    if (!event && parent && sub) {
      parent.sub.forEach((item, i) => {
        if (parent.sub[i].name === sub.name) {
          parent.sub[i].checked = 0;
        }
      });
    }

    let totalCuisine = [];
    this.cuisine = this.cuisineDraw;
    if (this.cuisine) {
      this.cuisine.forEach((item, j) => {
        if (this.cuisine[j].checked) {
          totalCuisine.push(this.cuisine[j].name);
          if (this.cuisine[j].sub) {
            this.cuisine[j].sub.forEach((subItem, i) => {
              if (this.cuisine[j].sub[i].checked) {
                totalCuisine.push(this.cuisine[j].sub[i].name);
              }
            });
          }
        }
      });
    }
    this.totalCuisine = totalCuisine.length;
  }

  public bestChangeCheckBox(event, item) {
    if (event) {
      item.checked = true;
      this.best.push(item);
    } else {
      item.checked = false;
      this.best.splice(this.best.length - 1, 1);
    }
  }

  public typeChangeCheckBox(event, item) {
    if (event) {
      item.checked = true;
      this.type.push(item);
    } else {
      item.checked = false;
      this.type.splice(this.type.length - 1, 1);
    }
  }

  public rateCheckbox(event, rate) {
    if (event) {
      rate.checked = true;
      this.currentRate.push(rate);
    } else {
      rate.checked = false;
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
        this.mapZoom = 14;
      }
    });
    this.items = [];
    this.markers = [];
    this.boundsChangeDefault.lat = event.getNorthEast().lat();
    this.boundsChangeDefault.lng = event.getNorthEast().lng();
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
      let distance: any = getDistance(searchCenter, latLngNew.getPosition());
      this.params.lat = this.lat;
      this.params.long = this.lng;
      this.params.page = 0;
      if (this.params.radius < 0.25) {
        this.params.radius = parseFloat((distance / 1000).toFixed(2));
      } else {
        this.params.radius = parseFloat((distance / 1000).toFixed(2)) - 0.25;
      }
      this.params.radius = parseFloat((distance / 1000).toFixed(2));
      this.shownotfound = false;
      this.getDataModes();
    }
  }

  private getPlaces(neighbourhood) {
    this.items = [];
    this.markers = [];
    if (neighbourhood !== 'Singapore') {
      this.mapZoom = 15;
    } else {
      this.mapZoom = 12;
    }
    this.mapsAPILoader.load().then(() => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({
          address: neighbourhood + ' Xinh-ga-po',
          region: 'sg'
        },
        (response, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
              this.lat = response[0].geometry.location.lat();
              this.lng = response[0].geometry.location.lng();
              this.params.lat = response[0].geometry.location.lat();
              this.params.long = response[0].geometry.location.lng();
              let latLngNew = new google.maps.Marker({
                position: new google.maps.LatLng(this.boundsChangeDefault.lat, this.boundsChangeDefault.lng),
                draggable: true
              });
              this.zoomChanged = true;
              let mapCenter = new google.maps.Marker({
                position: new google.maps.LatLng(this.lat, this.lng),
                draggable: true
              });
              let searchCenter = mapCenter.getPosition();
              let distance: any = getDistance(latLngNew.getPosition(), searchCenter);
              this.params.lat = this.lat;
              this.params.long = this.lng;
              this.params.page = 0;
              this.params.radius = parseFloat((distance / 1000).toFixed(2));
              this.getDataModes();
            }
          } else {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
            }
          }
        });
    });

  }

  private clearParams() {
    if (this.cuisine) {
      this.cuisine.forEach((item, i) => {
        this.cuisine[i].checked = false;
        if (this.cuisine[i].sub) {
          this.cuisine[i].sub.forEach((subItem, j) => {
            this.cuisine[i].sub[j].checked = false;
          });
        }
      });
    }
    if (this.best) {
      this.best.forEach((item, i) => {
        this.best[i].checked = false;
        if (this.best[i].sub) {
          this.best[i].sub.forEach((subItem, j) => {
            this.best[i].sub[j].checked = false;
          });
        }
      });
    }

    if (this.type.length) {
      this.type.forEach((item, i) => {
        if (this.type[i].checked) {
          this.type[i].checked = false;
          if (this.type[i].sub) {
            this.type[i].sub.forEach((subItem, j) => {
              this.type[i].sub[j].checked = false;
            });
          }
        }
      });
    }

    if (this.currentRate) {
      this.currentRate.forEach((item, i) => {
        this.currentRate[i].checked = false;
      });
    }

    this.cuisine = [];
    this.best = [];
    this.type = [];
    this.totalCuisine = 0;
    this.cuisineDraw = [];
    this.currentRate = [];
    this.priceRange = [0, 50];
    this.params.cuisine = '';
    this.params.price = '';
    this.params.bestfor = '';
    this.params.type = 'eat';
    this.params.limit = 20;
    this.params.page = 0;
    this.params.rate = '';
    this.params.types = '';
    this.params.order_by = 'Company_Name';
    this.params.order_dir = 'ASC';
    this.markers = [];
    this.items = [];
  }

  private setPosition(position) {
    if (position.coords) {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.params.lat = this.lat;
      this.params.long = this.lng;
      this.getDataModes();
    }
  }

  private getDataModes() {
    if (this.requests.length) {
      this.requests.forEach((req) => {
        req.unsubscribe();
      });
      this.requests = [];
    }
    this.smallLoader.show();
    const request = this.modeService.getModeData(this.params).subscribe(
      (data) => {
        this.total = data.total;
        this.items = this.loadMore ? this.items.concat(data.company) : data.company;
        this.shownotfound = data.total === 0;
        this.endRecord = data.company.length === 0;
        this.loadMore = false;
        this.initMap(data.company);
        this.loaderService.hide();
        this.smallLoader.hide();
      });
    this.requests.push(request);
  }

  private initMap(companies) {
    this.currentHighlightedMarker = 0;
    const currentIndex = this.markers.length;
    this.mapsAPILoader.load().then(() => {
      for (let i = 0; i < this.items.length; i++) {
        if (typeof companies[i].YP_Address !== 'undefined' || companies[i].YP_Address !== null) {

          let lat = companies[i].YP_Address[6].split('/');
          let lng = companies[i].YP_Address[5].split('/');
          let distance = companies[i]._dict_;
          let description: string;
          if (companies[i].Hylo_Activity_Description) {
            description = companies[i].Hylo_Activity_Description;
          } else {
            description = companies[i].Company_Profile;
          }
          companies[i].description = description;
          if (distance) {
            companies[i].distance = (distance).toFixed(1);
          }
          this.markers.push({
            lat: parseFloat(lat[1]),
            lng: parseFloat(lng[1]),
            label: companies[i].Company_Name,
            index: currentIndex + i,
            opacity: 0.4,
            isOpenInfo: false,
            icon: 'assets/icon/locationmarker.png',
            link: '/company/' + companies[i].Company_Slug,
            licenseNumber: companies[i].License_Number
          });
        }
      }
      this.zoomChanged = false;
    });
  }

  private highlightMarker(markerId: number, type: string): void {
    if (type === 'click') {
      this.markers.forEach((marker, index) => {
        if (index === markerId) {
          this.markers[index].opacity = 1;
          this.markers[index].isOpenInfo = true;
        } else {
          this.markers[index].opacity = 0.4;
          this.markers[index].isOpenInfo = false;
        }
      });
    } else {
      this.markers.forEach((marker, index) => {
        this.markers[index].opacity = index === markerId ? 1 : 0.4;
      });
    }
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
