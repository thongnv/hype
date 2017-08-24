import {
  Component, OnInit, ViewEncapsulation,
  EventEmitter, Output
} from '@angular/core';

import $ from 'jquery';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModeService } from '../../services/mode.service';
import { MapsAPILoader } from 'angular2-google-maps/core/services/maps-api-loader/maps-api-loader';
import { LoaderService } from '../../helper/loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSetting } from '../../app.setting';
import { AppGlobals } from '../../services/app.global';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import { Title } from '@angular/platform-browser';
import { LocalStorageService } from 'angular-2-local-storage';
import { WindowUtilService } from '../../services/window-ultil.service';
import {CompanyService} from '../../services/company.service';

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
  public currentRate: any = [];
  public best: any = [];
  public type: any = [];
  public mapZoom: number = 12;
  public lat: number = 1.359;
  public lng: number = 103.818;
  public currentRadius: any = 5000;
  public showAll: boolean = true;
  public showTab: boolean = true;
  public showCircle: boolean = true;
  public rateData: any = [{star: 1}, {star: 2}, {star: 3}, {star: 4}, {star: 5}];
  public shownotfound: boolean = false;
  public labelSort: string = 'Name';
  public gMapStyles: any;
  public screenWidth: number = 0;
  public screenHeight: number = 0;
  public totalCuisine: number = 0;
  public layoutWidth: number;
  public sortBy: any;
  public selected = 'all';
  public innerWidth: number;
  public showPrice: boolean = false;
  public showCuisine: boolean = false;
  public showRate: boolean = false;
  public showBest: boolean = false;
  public showType: boolean = false;

  private neighbourhood: string;
  private cuisineDraw = [];
  private loadMore: boolean = false;
  private categorySelected: any[] = [];
  private cuisine: any;
  private endRecord: boolean = false;
  private stopped: boolean = false;
  private catParam = {mode_type: ''};
  private total: number = 0;
  private requests = [];

  private params = {
    type: 'play',
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
    limit: 10
  };
  private zoomChanged: boolean = false;

  private boundsChangeDefault = {lat: '', lng: ''};

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
    this.titleService.setTitle('Hylo - Discover things to do in Singapore today');
    this.appGlobal.emitActiveType('play');
    window.scroll(0, 0);
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

    this.catParam.mode_type = 'mode_play';
    let params = this.catParam;
    this.modeService.getCategories(params).map((resp) => resp.json()).subscribe(
      (resp) => {
        this.categoriesDraw = resp.data;
        let numCategories = calculateNumCategories();
        this.categories = this.categoriesDraw.slice(0, numCategories);
    });
    this.getFilter();
    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    this.screenWidth = width;
    this.screenHeight = height;

    $('body').bind('DOMMouseScroll mousewheel touchmove', () => {
      $(window).scroll(() => {
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
          if (this.loadMore === false && this.endRecord === false) {
            this.loadMore = true;
            this.params.page = this.params.page + 1;
            this.getPlaces();
          }
        }
        if (this.stopped) {
          return;
        }
        const scrollElements = $('#v-scrollable');
        if (scrollElements.length) {
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
      this.neighbourhood = neighbourhood;
      window.scroll(0, 0);
      this.getPlaces();
    });
  }

  public boundsChange(event) {
    this.route.params.subscribe((param) => {
      if (param.location) {
        this.mapZoom = 14;
      }
    });
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
        this.params.radius = parseFloat((distance / 1000).toFixed(2));
      }
      this.smallLoader.show();
      this.items = [];
      this.markers = [];
      this.shownotfound = false;
      this.getPlaces();
    }
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
    this.highlightMarker(marker.index);
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
    this.getPlaces();
  }

  public filterSubmit() {
    let cuisine = [];
    let best = [];
    let type = [];
    let rate = [];
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
      this.params.types = type.join(',');
    }
    this.markers = [];
    this.items = [];
    this.params.page = 0;
    this.getPlaces();
  }

  public filterCancel() {
    this.filterCategory.value.filterCategory = 'all';
    this.clearParams();
    this.getPlaces();

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
    this.labelSort = label;
    this.params.order_dir = 'DESC';
    if (id === 'ratings') {
      this.params.order_by = 'ratings';
    } else if (id === 'reviews') {
      this.params.order_by = 'reviews';
    } else if (id === 'favorites') {
      this.params.order_by = 'favorites';
    } else if (id === 'views') {
      this.params.order_by = 'views';
    } else if (id === 'distance') {
      this.params.order_by = 'distance';
    } else {// id === 'all'
      this.params.order_by = 'Company_Name';
      this.params.order_dir = 'ASC';
    }
    this.params.page = 0;
    this.items = [];
    this.markers = [];
    this.smallLoader.show();
    this.getPlaces();

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
    this.smallLoader.show();
    this.getPlaces();
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

  private getFilter() {
    this.modeService.getFilterMode().map((resp) => resp.json()).subscribe((resp) => {
      this.filterData = resp.play;
    });
  }

  private getPlaces() {
    if (!this.loadMore) {
      this.items = [];
      this.markers = [];
    }
    if (this.neighbourhood !== 'Singapore') {
      this.mapZoom = 15;
    } else {
      this.mapZoom = 12;
    }
    this.mapsAPILoader.load().then(() => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({
          address: this.neighbourhood + ' Xinh-ga-po',
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
        this.initMap();
        this.loaderService.hide();
        this.smallLoader.hide();
      });
    this.requests.push(request);
  }

  private initMap() {
    this.currentHighlightedMarker = 0;
    if (this.items.length) {
      this.mapsAPILoader.load().then(() => {
        for (let i = 0; i < this.items.length; i++) {
          if (typeof this.items[i].YP_Address !== 'undefined' || this.items[i].YP_Address !== null) {

            let lat = this.items[i].YP_Address[6].split('/');
            let lng = this.items[i].YP_Address[5].split('/');
            let distance = this.items[i]._dict_;

            if (distance) {
              this.items[i].distance = (distance).toFixed(1);
            }
            this.markers.push({
              lat: parseFloat(lat[1]),
              lng: parseFloat(lng[1]),
              label: this.items[i].Company_Name,
              index: i,
              opacity: 0.4,
              isOpenInfo: false,
              icon: 'assets/icon/locationmarker.png',
              link: '/company/' + this.items[i].Company_Slug,
              licenseNumber: this.items[i].License_Number
            });
          }
        }
        this.zoomChanged = false;
      });
    }
  }

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

    if (this.type) {
      this.type.forEach((item, i) => {
        this.type[i].checked = false;
        if (this.type[i].sub) {
          this.type[i].sub.forEach((subItem, j) => {
            this.type[i].sub[j].checked = false;
          });
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
    this.params.type = 'play';
    this.params.limit = 20;
    this.params.page = 0;
    this.params.rate = '0';
    this.params.types = '';
    this.params.order_by = 'Company_Name';
    this.params.order_dir = 'ASC';
    this.markers = [];
    this.items = [];
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
