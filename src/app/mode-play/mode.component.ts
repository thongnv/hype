import { Component, OnInit,ViewEncapsulation,NgZone,AfterViewInit, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap'
import {ModeService} from "../services/mode.service";
import {GoogleMapsAPIWrapper} from "angular2-google-maps/core/services/google-maps-api-wrapper";
import {MapsAPILoader} from "angular2-google-maps/core/services/maps-api-loader/maps-api-loader";
import {LoaderService} from "../shared/loader/loader.service";
import { Ng2ScrollableDirective } from 'ng2-scrollable';
import { ActivatedRoute, Router } from '@angular/router';
import { scrollTo } from 'ng2-utils';
import { AppSetting } from '../app.setting';
import {SmallLoaderService} from "../shared/small-loader/small-loader.service";

declare let google:any;

@Component({
    moduleId: "hylo-mode",
    selector: 'app-mode',
    templateUrl: './mode.component.html',
    styleUrls: ['./mode.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [NgbRatingConfig],
})


export class ModeComponent implements OnInit {
    @Output('onScrollToBottom') public onScrollToBottom = new EventEmitter<any>();

    public markers:any = [];
    public categories:any = [];
    public categoriesDraw:any[];
    public priceRange:number[] = [0, 50];
    public filterFromMode:FormGroup;
    public filterCategory:FormGroup;
    public items = [];
    public filterData:any = [];
    public currentHighlightedMarker:number = 1;
    public currentRate = 0;
    private cuisine:any;
    public best:any = [];
    public type:any = [];
    public mapZoom:number = 12;
    public lat:number = 1.3089757786697331;
    public lng:number = 103.8258969783783;
    public currentRadius:any = 5000;
    private catParam = {mode_type: ''};
    public showMap:boolean = false;
    private total:number = 0;
    public showAll:boolean = true;
    public showTab:boolean = true;
    public alertType:any = '';
    public msgContent:any = '';
    public showCircle:boolean = true;
    public gMapStyles:any;
    public sortPlace:string = 'all';
    private loadMore:boolean = false;
    public circleDraggable:boolean = false;
    public screenWidth:number = 0;
    public screenHeight:number = 0;
    public totalCuisine:number = 0;
    private params = {
        type: 'all',
        kind: '',
        price: '',
        //activity: '',
        cuisine: '',
        rate: 0,
        bestfor: '',
        types: '',
        order_by: 'Company_Name',
        order_dir: 'ASC',
        lat: this.lat,
        long: this.lng,
        radius: (this.currentRadius / 1000),
        page: 0,
        limit: 20
    };

    public sortBy:any;

    public constructor(private formBuilder:FormBuilder,
                       private modeService:ModeService,
                       private rateConfig:NgbRatingConfig,
                       private mapsAPILoader:MapsAPILoader,
                       private loaderService:LoaderService,
                       private smallLoader:SmallLoaderService,
                       private route:ActivatedRoute,
                       private router:Router) {

        this.filterFromMode = this.formBuilder.group({
            filterMode: 'all'
        });

        this.filterCategory = this.formBuilder.group({
            filterCategory: 'all'
        });
        //console.log(this.is)
        this.sortBy = [
            {"id": "all", "name": 'Sort By'},
            {"id": "ratings", "name": "Ratings"},
            {"id": "reviews", "name": "Number of reviews"},
            {"id": "views", "name": "Popularity (Pageviews)"},
            {"id": "favorites", "name": "Number of favorites"},
            {"id": "distance", "name": "Distance (KM)"}
        ];
        this.rateConfig.max = 5;
        this.rateConfig.readonly = false;
    }

    public ngOnInit() {
        this.gMapStyles = AppSetting.GMAP_STYLE;
        this.getCategories(this.filterFromMode.value.filterMode);
        this.getDataModes();
        this.getFilter();
        let width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        let height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        this.screenWidth = width;
        this.screenHeight = height;

        // this.renderMaker(5000);
        this.route.params.subscribe((param) => {
            if (param.location) {
                this.mapsAPILoader.load().then(() => {
                    let geocoder = new google.maps.Geocoder();
                    if (geocoder) {
                        geocoder.geocode({'address': param.location, 'region': 'sg'}, (response, status)=> {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                                    this.lat = response[0].geometry.location.lat();
                                    this.lng = response[0].geometry.location.lng()
                                }
                            } else {

                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
                                }
                            }
                        });
                    }
                });

            } else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
                }

            }
        });
    }

    public onResize(event):void {
        let width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        let height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        this.screenWidth = width;
        this.screenHeight = height;

        let number = Math.floor(this.screenWidth / 55) - 1;
        if (this.screenWidth < 992) {
            this.categories = this.categoriesDraw.slice(0, number - 1);
        } else {
            if (this.screenWidth < 1025) {
                this.categories = this.categoriesDraw.slice(0, 4);
            } else {
                this.categories = this.categoriesDraw.slice(0, 6);
            }
        }
    }

    setPosition(position) {
        if (position.coords) {
            this.lat = position.coords.lat;
            this.lng = position.coords.lng;
            console.log(this.lat);
        }

    }


    getDataModes() {
        let params = this.params;
        this.loaderService.show();
        this.smallLoader.show();

        this.modeService.getModes(params).map(resp=>resp.json()).subscribe((resp)=> {

            this.total = resp.total;
            if (parseInt(resp.total) > 0) {
                this.showMap = true;
            }
            if (this.loadMore) {
                this.initMap(this.items.concat(resp.company));
            } else {
                this.initMap(resp.company);
            }
            this.loaderService.hide();
            this.smallLoader.hide();

        }, err=> {
            this.items = [];
            this.markers = [];
            this.loaderService.hide();
            this.smallLoader.hide();
        });
    }

    changeCategory() {
        this.params.limit = 20;
        this.params.page = 0;
        this.markers = [];
        this.items = [];

        this.smallLoader.show();
        this.params.kind = this.filterCategory.value.filterCategory;
        this.getDataModes();
    }

    getCategories(value) {
        if (value == 'play' || value == 'eat') {
            this.catParam.mode_type = 'mode_' + value;
        } else {
            this.catParam.mode_type = '';
        }
        let params = this.catParam;
        this.modeService.getCategories(params).map(resp=>resp.json()).subscribe((resp)=> {
            this.categoriesDraw = resp.data;
            let number = Math.floor(this.screenWidth / 55) - 1;
            if (this.screenWidth < 992) {
                this.categories = this.categoriesDraw.slice(0, number - 1);
            } else {
                if (this.screenWidth < 1025) {
                    this.categories = this.categoriesDraw.slice(0, 4);
                } else {
                    this.categories = this.categoriesDraw.slice(0, 6);
                }
            }
        });

    }

    getFilter() {
        this.modeService.getFilterMode().map(resp=>resp.json()).subscribe((resp)=> {
            if (this.filterFromMode.value.filterMode == 'play') {
                this.filterData = resp.play;
            } else if (this.filterFromMode.value.filterMode == 'eat') {
                this.filterData = resp.eat;
            }
            else {
                let filterAll = resp.eat;
                //let cuisine = resp.play.cuisine;
                let best = resp.play.best;
                let type = resp.play.type;

                //filterAll.cuisine = filterAll.cuisine.concat(cuisine);
                filterAll.best = filterAll.best.concat(best);
                filterAll.type = filterAll.type.concat(type);
                this.filterData = filterAll;
            }
        });
    }


    markerDragEnd($event) {
        if ($event.coords) {
            console.log('dragEnd', $event);
            //Update center map
            this.lat = $event.coords.lat;
            this.lng = $event.coords.lng;
        }
    }

    markerRadiusChange(event) {
        let radius = parseInt(event);
        this.currentRadius = radius;
        this.params.radius = (radius / 1000);
        this.getDataModes();
    }

    changeType() {

        this.params.limit = 20;
        this.params.page = 0;
        this.markers = [];
        this.items = [];

        this.params.type = this.filterFromMode.value.filterMode;
        this.params.kind = '';
        this.getCategories(this.filterFromMode.value.filterMode);
        this.getDataModes();
        this.getFilter();

    }

    private initMap(companies:any) {
        this.items = [];
        this.markers = [];
        if (companies) {
            this.mapsAPILoader.load().then(() => {

                let mapCenter = new google.maps.Marker({
                    position: new google.maps.LatLng(this.lat, this.lng),
                    draggable: true
                });
                let searchCenter = mapCenter.getPosition();

                for (let i = 0; i < companies.length; i++) {
                    if (typeof companies[i].YP_Address !== 'undefined' || companies[i].YP_Address !== null) {

                        let lat = companies[i].YP_Address[6].split("/");
                        let lng = companies[i].YP_Address[5].split("/");

                        let myMarker = new google.maps.Marker({
                            position: new google.maps.LatLng(parseFloat(lat[1]), parseFloat(lng[1])),
                            draggable: true
                        });
                        let distance = companies[i]._dict_;
                        companies[i].distance = (distance).toFixed(1);
                        let geometry = google.maps.geometry.spherical.computeDistanceBetween(myMarker.getPosition(), searchCenter);
                        if (parseInt(geometry) < this.currentRadius) {
                            this.items.push(companies[i]);
                            this.markers.push({
                                lat: parseFloat(lat[1]),
                                lng: parseFloat(lng[1]),
                                label: companies[i].Company_Name,
                                opacity: 0.6,
                                isOpenInfo: false
                            });
                        }
                    }
                }
            });
        }
    }

    private getDistance(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.lat() - p1.lat());
        var dLong = this.rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    private rad(x) {
        return x * Math.PI / 180;
    }

    public clickedMarker(selector, horizontal) {
        scrollTo(
            '#v' + selector,
            '#v-scrollable',
            horizontal,
            0
        );

    }

    public onScroll(event) {
        let elm = event.srcElement;
        let baseHeight = event.target.clientHeight;
        let realScrollTop = event.target.scrollTop + baseHeight;
        let currentHeight:number = baseHeight;

        // determine just scrolled to end
        if (elm.clientHeight + elm.scrollTop + elm.clientTop === elm.scrollHeight) {
            console.log('end, params: ', this.params);
            if (this.total > this.items.length) {
                this.loadMore = true;
                this.params.page += 1;
                this.getDataModes();
            }
        }

        if (event.target.children[0].children.length > 1) {
            for (let i = 0; i < event.target.children[0].children.length; i++) {
                let currentClientH = event.target.children[0].children[i].clientHeight;
                currentHeight += currentClientH;
                if (currentHeight - currentClientH <= realScrollTop && realScrollTop <= currentHeight) {
                    if (this.currentHighlightedMarker !== i) {
                        this.currentHighlightedMarker = i;
                        this.highlightMarker(i);
                    }
                }
            }
        }
    }

    private highlightMarker(markerId:number):void {
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

    filterSubmit() {
        let cuisine = new Array();
        let best = new Array();
        let type = new Array();
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
            for (let b in this.best) {
                best.push(b);
            }
        }
        if (this.type) {
            for (let t in this.type) {
                type.push(t);
            }
        }
        if (this.showPrice) {
            this.params.price = this.priceRange.join(',');
        }
        if (this.showCuisine) {
            if (this.filterFromMode.value.filterMode == 'play') {
                this.params.activity = cuisine.join(',');
            } else {
                this.params.cuisine = cuisine.join(',');
            }
        }
        if (this.showBest) {
            this.params.bestfor = best.join(',');
        }
        if (this.showRate) {
            this.params.rate = this.currentRate;
        }
        if (this.type) {
            this.params.types = type.join(',');
        }
        this.smallLoader.show();
        this.getDataModes();
    }

    public filterCancel() {
        this.filterFromMode.value.filterMode = 'all';
        this.filterCategory.value.filterCategory = 'all';
        this.clearParams();
        this.getDataModes();


    }

    showAllKind(e) {
        if (e) {
            this.categories = this.categoriesDraw;
            this.showAll = false;
        } else {
            let number = Math.floor(this.screenWidth / 55) - 1;
            if (this.screenWidth < 992) {
                this.categories = this.categoriesDraw.slice(0, number - 1);
            } else {
                if (this.screenWidth < 1025) {
                    this.categories = this.categoriesDraw.slice(0, 4);
                } else {
                    this.categories = this.categoriesDraw.slice(0, 6);
                }
            }
            this.showAll = true;
        }
    }

    onLikeEmit(item:any) {
        item.is_favorite = !item.is_favorite;
        let params = {
            ids_no: item.Ids_No
        }
        this.smallLoader.show();
        this.modeService.favoritePlace(params).map(res=>res.json()).subscribe(res=> {
            this.alertType = 'success';
            this.msgContent = res.message;

            this.smallLoader.hide();
        }, err=> {
            this.smallLoader.hide();
            if (err.status == 401 || err.status == 403) {
                this.router.navigate(['login']);
            }
            console.log(err);
        });
    }

    showAllType(e) {
        if (e) {
            this.showTab = false;
        } else {
            this.showTab = true;
        }
    }

    public showPrice:boolean = false;
    public showCuisine:boolean = false;
    public showRate:boolean = false;
    public showBest:boolean = false;
    public showType:boolean = false;

    showRagePriceFind(e) {
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

    showCuisineFind(e) {
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

    showRateFind(e) {
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


    showBestFind(e) {
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

    showTypeFind(e) {
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
            this.params.order_by = "ratings";
            this.params.order_dir = 'DESC';
        }
        if (this.sortPlace == 'reviews') {
            this.params.order_by = "reviews";
            this.params.order_dir = 'DESC';
        }
        if (this.sortPlace == 'favorites') {
            this.params.order_by = "favorites";
            this.params.order_dir = 'DESC';
        }
        if (this.sortPlace == 'views') {
            this.params.order_by = "views";
            this.params.order_dir = 'DESC';
        }
        if (this.sortPlace == 'distance') {
            this.params.order_by = "distance";
            this.params.order_dir = 'DESC';
        } else {
            this.params.order_by = "Company_Name";
            this.params.order_dir = 'DESC';
        }
        this.getDataModes();

    }

    public clearAllFilter() {
        this.clearParams();
        this.params.radius = 5;
        this.sortPlace = 'all';
        this.getDataModes();
    }

    private clearParams() {
        this.cuisine = [];
        this.type = [];
        this.best = [];
        this.currentRate = 0;
        this.priceRange = [0, 50];
        this.params.cuisine = '';
        this.params.price = '';
        this.params.bestfor = '';
        this.params.type = '';
        this.params.limit = 20;
        this.params.page = 0;
        this.params.order_by = "Company_Name";
        this.params.order_dir = 'DESC';
        this.markers = [];
        this.items = [];
    }

    private cuisineDraw = [];

    selectCheckBox(event, parent, sub) {
        if (event) {
            if (sub) {
                parent.checked = true;
                console.log(1);
                for (let i = 0; i < parent.sub.length; i++) {
                    if (parent.sub[i].name == sub.name) {
                        parent.sub[i].checked = true;
                    }
                }
                this.cuisineDraw.push(parent);
            } else {
                console.log(2);
                if (parent.sub) {
                    for (let i = 0; i < parent.sub.length; i++) {
                        parent.sub[i].checked = true;
                    }
                } else {
                    parent.checked = true;
                }
                this.cuisineDraw.push(parent);
            }
        } else {
            if (sub) {
                console.log(3);
                if (parent.sub) {
                    for (let i = 0; i < parent.sub.length; i++) {
                        if (parent.sub[i].name == sub.name) {
                            parent.sub[i].checked = false;
                        }
                    }
                } else {
                    parent.checked = false;
                }
                this.cuisineDraw = this.cuisineDraw.filter(function (el) {
                    return el.name !== parent.name;
                });

            } else {
                console.log(4);
                if (parent.sub) {
                    for (let i = 0; i < parent.sub.length; i++) {
                        parent.sub[i].checked = false;
                    }
                } else {
                    parent.checked = false;
                }
                this.cuisineDraw = this.cuisineDraw.filter(function (el) {
                    return el.name !== parent.name;
                });
            }
        }
        let totalCuisine = [];
        this.cuisine = this.cuisineDraw;
        if (this.cuisine) {
            for (let j = 0; j < this.cuisine.length; j++) {
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
        this.totalCuisine = totalCuisine.length;

    }

    bestChangeCheckBox(event, item) {
        if (event) {
            this.best.push(item.name);
        } else {
            this.best.splice(this.best.length - 1, 1);
        }
    }

    typeChangeCheckBox(event, item) {
        if (event) {
            this.type.push(item.name);
        } else {
            this.type.splice(this.type.length - 1, 1);
        }
    }
}
