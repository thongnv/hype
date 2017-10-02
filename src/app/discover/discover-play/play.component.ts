import $ from 'jquery';
import { isNull, isUndefined } from 'util';

import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { MapsAPILoader } from 'angular2-google-maps/core/services/maps-api-loader/maps-api-loader';

import { LoaderService } from '../../helper/loader/loader.service';
import { AppSetting } from '../../app.setting';
import { AppGlobals } from '../../services/app.global';
import { ModeService } from '../../services/mode.service';
import { WindowUtilService } from '../../services/window-ultil.service';
import { CompanyService } from '../../services/company.service';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import { HyloLocation } from '../../app.interface';

declare let google: any;

const DEFAULT_PARAMS = {
  type: 'play',
  kind: '',
  price: '',
  activity: '',
  cuisine: '',
  rate: '',
  bestfor: '',
  types: '',
  order_by: '',
  order_dir: 'ASC',
  lat: AppSetting.SingaporeLatLng.lat,
  long: AppSetting.SingaporeLatLng.lng,
  radius: 0,
  page: 0,
  limit: 10
};

const SORT_BY = [
  {id: 'relevance', name: 'Relevance'},
  {id: 'name', name: 'Name'},
  {id: 'ratings', name: 'Ratings'},
  {id: 'reviews', name: 'Number of reviews'},
  {id: 'views', name: 'Popularity (Pageviews)'},
  {id: 'favorites', name: 'Number of favorites'},
  {id: 'distance', name: 'Distance (KM)'}
];

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
  // company list
  public places = [];
  // gmap markers
  public markers = [];
  // categories
  public categories = [];
  public categoriesDraw: any[];
  public selected = 'all';
  public selectedCategories = [];
  public showAll = true;
  // filter params
  public filterCategory: FormGroup;
  public priceRange: number[] = [0, 50];
  public filterData = [];
  public selectedRatings = [];
  public best = [];
  public type = [];
  public labelSort = 'Relevance';
  public sortBy = SORT_BY;
  public activitiesCount = 0;
  public ratings = [1, 2, 3, 4, 5];
  public showTab = true;
  public showPrice = false;
  public showCuisine = false;
  public showRate = false;
  public showBest = false;
  public showType = false;
  // gmap
  public gMapStyles: any;
  public mapZoom = 12;
  public lat = AppSetting.SingaporeLatLng.lat;
  public lng = AppSetting.SingaporeLatLng.lng;
  public userLatLng = {
    lat : this.lat,
    lng : this.lng
  };
  public currentRadius = 5000;

  public screenWidth: number;
  public screenHeight: number;
  public innerWidth: number;
  public layoutWidth: number;

  public showNotFound = false;

  private neighbourhood: HyloLocation;
  private cuisineDraw = [];
  private loadMore = false;
  private cuisine: any;
  private endRecord = false;
  private stopped = false;

  private params = DEFAULT_PARAMS;
  private requests = [];
  private zoomChanged = false;
  private neighbourhoodChanged = false;
  private boundPosition = {lat: '', lng: ''};

  public constructor(private titleService: Title,
                     private formBuilder: FormBuilder,
                     private modeService: ModeService,
                     private rateConfig: NgbRatingConfig,
                     private mapsAPILoader: MapsAPILoader,
                     private loaderService: LoaderService,
                     private smallLoader: SmallLoaderService,
                     private router: Router,
                     private localStorageService: LocalStorageService,
                     private windowRef: WindowUtilService,
                     public appGlobal: AppGlobals,
                     private companyService: CompanyService) {
  }

  public ngOnInit() {
    window.scroll(0, 0);
    this.titleService.setTitle('Hylo - Discover things to do in Singapore today');
    this.appGlobal.emitActiveType('play');
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.filterCategory = this.formBuilder.group({
      filterCategory: 'all'
    });

    this.screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;

    this.rateConfig.max = 5;
    this.rateConfig.readonly = false;
    this.modeService.getCategories({mode_type: 'mode_play'}).map((resp) => resp.json()).subscribe(
      (resp) => {
        this.categoriesDraw = resp.data;
        const numCategories = calculateNumCategories(this.layoutWidth);
        this.categories = this.categoriesDraw.slice(0, numCategories);
      });
    this.modeService.getFilterMode().map((resp) => resp.json()).subscribe((resp) => {
      this.filterData = resp.play;
    });

    if (this.innerWidth <= 900) {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = false;
    } else {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = true;
    }
    this.appGlobal.toggleMap = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    }
    this.appGlobal.neighbourhoodStorage.subscribe((neighbourhood) => {
      this.neighbourhoodChanged = true;
      this.neighbourhood = neighbourhood;
      window.scroll(0, 0);
      this.params.page = 0;
      this.getPlaces(neighbourhood);
    });
  }

  public handleScroll(event) {
    $(window).scroll(() => {
      if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
        if (this.loadMore === false && this.endRecord === false) {
          this.loadMore = true;
          this.params.page = this.params.page + 1;
          this.getDataModes(this.params);
        }
      }
      if (this.stopped) {
        return;
      }
      const container = $('#v-scrollable')[0];
      if (container) {
        let currentHeight = container.clientHeight;
        let top = $(window).scrollTop() + currentHeight;
        let items = container.children;
        for (let i = 0, x = items.length; i < x; i++) {
          const currentClientH = items[i].clientHeight;
          currentHeight += currentClientH;
          if (currentHeight >= top && currentHeight - currentClientH <= top) {
            this.markers.forEach((marker, index) => {
              this.markers[index].opacity = index === i ? 1 : 0.4;
            });
          }
        }
      }
    });
  }

  public centerChange(event) {
    this.zoomChanged = true;
    this.lat = event.lat;
    this.lng = event.lng;
  }

  public boundsChange(event) {
    this.markers = [];
    this.boundPosition.lat = event.getNorthEast().lat();
    this.boundPosition.lng = event.getNorthEast().lng();
    if (this.zoomChanged && !this.neighbourhoodChanged) {
      this.mapsAPILoader.load().then(() => {
        let northEastPosition = new google.maps.Marker({
          position: new google.maps.LatLng(this.boundPosition.lat, this.boundPosition.lng),
          draggable: true
        });
        let mapCenter = new google.maps.Marker({
          position: new google.maps.LatLng(this.lat, this.lng),
          draggable: true
        });
        let searchCenter = mapCenter.getPosition();
        let distance = getDistance(searchCenter, northEastPosition.getPosition());
        this.zoomChanged = false;
        this.params.lat = this.lat;
        this.params.long = this.lng;
        this.params.page = 0;
        if (this.params.radius < 0.25) {
          this.params.radius = parseFloat((distance / 1000).toFixed(2));
        } else {
          this.params.radius = parseFloat((distance / 1000).toFixed(2)) - 0.25;
        }
        this.getDataModes(this.params);
      });
    }
  }

  public onResize(event): void {
    this.innerWidth = this.windowRef.nativeWindow.innerWidth;
    this.layoutWidth = (this.windowRef.rootContainer.width - 180) / 2;
    let numCategories = calculateNumCategories(this.layoutWidth);
    this.categories = this.categoriesDraw.slice(0, numCategories);
  }

  public clickedMarker(marker) {
    this.highlightMarker(marker.index);
    this.stopped = true;
    $('html, body').animate({
      scrollTop: $('#v' + marker.index).offset().top - 80
    }, 'slow');

    // set image for info window
    marker.avatar = 'assets/img/company/default_140x140.jpg';
    this.companyService.getInstagramProfile(marker.licenseNumber).subscribe(
      (profile) => {
        marker.avatar = profile[0] ? profile[0] : 'assets/img/company/default_140x140.jpg';
        this.stopped = false;
      },
      (error) => {
        console.log(error);
        this.stopped = false;
      });

  }

  public changeCategory(item) {
    if (item === 'all') {
      this.categories.forEach((category, index) => {
        this.categories[index].selected = false;
      });
      this.selected = 'all';
      this.params.kind = '';
      this.selectedCategories = [];
    } else {
      this.selected = '';
      if (item.selected) {
        item.selected = false;
        let index = this.selectedCategories.indexOf(item.name);
        this.selectedCategories.splice(index, 1);
      } else {
        item.selected = true;
        this.selectedCategories.push(item.name);
      }
      if (this.selectedCategories.length === 0) {
        this.selected = 'all';
      }
      this.params.kind = this.selectedCategories.join(',');
    }
    this.params.limit = 20;
    this.params.page = 0;
    this.markers = [];
    this.places = [];
    this.getDataModes(this.params);
  }

  public filterSubmit() {
    let cuisine = [];
    let best = [];
    let type = [];
    let ratings = [];
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
    if (this.selectedRatings) {
      for (let rating of this.selectedRatings) {
        ratings.push(rating);
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
      this.params.rate = ratings.join(',');
    }
    if (this.type) {
      this.params.types = type.join(',');
    }
    this.markers = [];
    this.places = [];
    this.params.page = 0;
    this.getDataModes(this.params);
  }

  public filterCancel() {
    this.filterCategory.value.filterCategory = 'all';
    this.clearParams();
    this.getDataModes(this.params);

  }

  public showAllCategories(e) {
    if (e) {
      this.showAll = false;
      this.categories = this.categoriesDraw;
    } else {
      this.showAll = true;
      let numCategories = calculateNumCategories(this.layoutWidth);
      this.categories = this.categoriesDraw.slice(0, numCategories);
    }
  }

  public onLikeEmit(item: any) {
    if (!this.localStorageService.get('user')) {
      this.router.navigate(['login']).then();
      return;
    }
    item.is_favorite = !item.is_favorite;
    this.modeService.favoritePlace(item.Ids_No).subscribe();
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
    if (id === 'name') {
      this.params.order_by = 'Company_Name';
      this.params.order_dir = 'ASC';
    } else {
      // id = ratings, reviews, favorites, views, distance
      if (id === 'relevance') {
        id = '';
      }
      this.params.order_by = id;
      this.params.order_dir = 'DESC';
    }
    this.params.page = 0;
    this.places = [];
    this.markers = [];
    this.getDataModes(this.params);
  }

  public clearAllFilter() {
    this.clearParams();
    this.labelSort = 'Relevance';
    this.activitiesCount = 0;
    this.showCuisine = false;
    this.showPrice = false;
    this.showRate = false;
    this.showBest = false;
    this.showType = false;
    this.getDataModes(this.params);
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

    let cuisines = [];
    this.cuisine = this.cuisineDraw;
    if (this.cuisine) {
      this.cuisine.forEach((item, j) => {
        if (this.cuisine[j].checked) {
          cuisines.push(this.cuisine[j].name);
          if (this.cuisine[j].sub) {
            this.cuisine[j].sub.forEach((subItem, i) => {
              if (this.cuisine[j].sub[i].checked) {
                cuisines.push(this.cuisine[j].sub[i].name);
              }
            });
          }
        }
      });
    }
    this.activitiesCount = cuisines.length;
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
      this.selectedRatings.push(rate);
    } else {
      let index = this.selectedRatings.indexOf(rate);
      this.selectedRatings.splice(index, 1);
    }
  }

  private getPlaces(neighbourhood) {
    this.smallLoader.show();
    if (!this.loadMore) {
      this.places = [];
      this.markers = [];
    }
    this.mapZoom = this.neighbourhood.name === 'Singapore' ? 12 : 14;
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    // }
    this.lat = neighbourhood.lat;
    this.lng = neighbourhood.lng;
    this.mapsAPILoader.load().then(() => {
      let latLngNew = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat, this.lng),
        draggable: true
      });
      this.zoomChanged = false;
      let mapCenter = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat, this.lng),
        draggable: true
      });
      let searchCenter = mapCenter.getPosition();
      let distance: any = getDistance(searchCenter, latLngNew.getPosition());
      this.params.lat = this.lat;
      this.params.long = this.lng;
      if (this.params.radius < 0.25) {
        this.params.radius = parseFloat((distance / 1000).toFixed(2));
      } else {
        this.params.radius = parseFloat((distance / 1000).toFixed(2)) - 0.25;
      }
      this.getDataModes(this.params);
    });
  }

  private setPosition(position) {
    if (position.coords) {
      this.lat = this.userLatLng.lat = position.coords.latitude;
      this.lng = this.userLatLng.lat = position.coords.longitude;
      this.params.lat = this.lat;
      this.params.long = this.lng;
    }
  }

  private getDataModes(params) {
    if (this.requests.length) {
      this.requests.forEach((req) => {
        req.unsubscribe();
      });
      this.requests = [];
    }
    this.smallLoader.show();
    const request = this.modeService.getModeData(params).subscribe(
      (data) => {
        this.places = this.loadMore ? this.places.concat(data.company) : data.company;
        this.showNotFound = data.total === 0;
        this.endRecord = data.company.length === 0;
        this.loadMore = false;
        this.neighbourhoodChanged = false;
        this.initMap(data.company);
        this.loaderService.hide();
        this.smallLoader.hide();
      });
    this.requests.push(request);
  }

  private initMap(items) {
    const currentIndex = this.markers.length;
    if (items.length) {
      this.mapsAPILoader.load().then(() => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (!isUndefined(item.YP_Address) || !isNull(item.YP_Address)) {
            let lat = item.YP_Address[6].split('/')[1];
            let lng = item.YP_Address[5].split('/')[1];
            let distance = item._dict_;
            if (distance) {
              item.distance = distance.toFixed(1);
            }
            this.markers.push({
              lat: parseFloat(lat) || AppSetting.SingaporeLatLng.lat,
              lng: parseFloat(lng) || AppSetting.SingaporeLatLng.lng,
              label: item.Company_Name,
              index: currentIndex + i,
              opacity: 0.4,
              isOpenInfo: false,
              icon: 'assets/icon/locationmarker.png',
              link: '/company/' + item.Company_Slug,
              licenseNumber: item.License_Number
            });
          }
        }
        this.zoomChanged = false;
      });
    }
  }

  private highlightMarker(markerId: number): void {
    this.markers.forEach((marker, index) => {
      this.markers[index].isOpenInfo = index === markerId;
      this.markers[index].opacity = index === markerId ? 1 : 0.4;
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

    if (this.selectedRatings) {
      this.selectedRatings.forEach((item, i) => {
        this.selectedRatings[i].checked = false;
      });
    }
    this.cuisine = [];
    this.best = [];
    this.type = [];
    this.activitiesCount = 0;
    this.cuisineDraw = [];
    this.selectedRatings = [];
    this.priceRange = [0, 50];
    this.params.cuisine = '';
    this.params.price = '';
    this.params.bestfor = '';
    this.params.type = 'play';
    this.params.limit = 20;
    this.params.page = 0;
    this.params.rate = '0';
    this.params.types = '';
    this.params.order_by = '';
    this.params.order_dir = 'ASC';
    this.markers = [];
    this.places = [];
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

function distance(lat1, lon1, lat2, lon2) {
  let p = 0.017453292519943295;    // Math.PI / 180
  let c = Math.cos;
  let a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lon2 - lon1) * p)) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
