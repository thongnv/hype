// core
import {Component, OnInit,HostListener,ViewChild,Inject} from '@angular/core';
import { Router } from '@angular/router';

// 3rd libs
import * as moment from 'moment/moment';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {any} from "codelyzer/util/function";
import { Ng2ScrollableDirective } from 'ng2-scrollable';
import { scrollTo } from 'ng2-utils';
import {MapsAPILoader} from "angular2-google-maps/core/services/maps-api-loader/maps-api-loader";
import { DOCUMENT } from "@angular/platform-browser";

// services
import { MainService } from '../services/main.service';
import {HomeService} from "../services/home.service";
import {LoaderService} from "../shared/loader/loader.service";

// models
import { EventType } from '../app.interface';

// components
import {EventItemComponent} from '../event/event-item/event-item.component';
import { AppSetting } from '../app.setting';
import {of} from "rxjs/observable/of";
import {SmallLoaderService} from "../shared/small-loader/small-loader.service";

// assets
const MARKER_ICON = '/assets/icon/icon_pointer.png';
const MARKER_ICON_SELECTED = '/assets/icon/icon_pointer_selected.png';


const now = new Date();
declare let google:any;
@Component({
    selector: 'home',
    providers: [],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    @ViewChild(EventItemComponent)
    private eventItem:EventItemComponent;

    // Set our default values
    public gMapStyles:any;
    public localState = {value: ''};
    public eventFilter:any[] = [];
    public selectedEventFilter:any;
    public eventOrder:any[] = [];
    public selectedEventOrder:any;
    public events:any = [];
    private listItems:any[] = [];
    public lists:any[] = [];
    public markers:any[] = [];
    public mapZoom:number = 12;
    public lat:number = 1.359;
    public lng:number = 103.818;
    public currentRadius:any = 5000;
    public priceRange:number[] = [0, 50];
    public categories:any[];
    public selected:any = 'all';
    public tabActive:boolean = false;
    public isOpen:boolean = false;
    public currentHighlightedMarker:number = 1;
    public alertType:any = '';
    public showPrice:boolean = false;
    public showDate:boolean = false;
    public msgContent:any = '';
    public showAll:boolean = true;
    private total:any;
    public showCircle:boolean = false;
    private loadMore:boolean = false;
    public screenWidth:number = 0;
    public screenHeight:number = 0;
    public circleDraggable:boolean = true;
    private params:any = {
        'page': 0,
        'limit': 20,
        'start': 0,
        'tid': '',
        'date': '',
        'latest': '',
        'weekend': '',
        'when': '',
        'lat': this.lat,
        'long': this.lng,
        'radius': (this.currentRadius / 1000),
        'price': ''
    };
    private userProfile:any;
    public drawCategories:any[];

    //date picker
    model:NgbDateStruct;
    date:{year: number, month: number};

    // TypeScript public modifiers
    constructor(private mainService:MainService,
                private homeService:HomeService,
                private loaderService:LoaderService,
                private smallLoader:SmallLoaderService,
                private mapsAPILoader:MapsAPILoader,
                private route:Router,
                @Inject(DOCUMENT) private document:Document) {
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

    }

    public ngOnInit() {
        this.gMapStyles = AppSetting.GMAP_STYLE;
        this.selectedEventOrder = this.eventOrder[0];
        this.selectedEventFilter = this.eventFilter[0];
        this.selected = 'all';
        this.getTrending();
        this.getTrandingCategories();

        let width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        let height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        this.screenWidth = width;
        this.screenHeight = height;

    }

    // set position current
    setPosition(position) {
        if (position.coords) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.params.lat = this.lat;
            this.params.long = this.lng;
        }

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
        if (this.screenWidth <= 768) {
            if (this.drawCategories.length > number) {
                this.categories = this.drawCategories.slice(0, number - 1);
            } else {
                this.categories = this.drawCategories;
            }
        } else {
            if (this.drawCategories.length > number) {
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

    public onSelectEventType(event):void {
        if (event == 'all') {
            this.selected = 'all';
            this.params.tid = '';
        } else {
            this.selected = event.tid;
            this.params.tid = event.tid;
        }
        this.markers = [];
        this.events = [];
        this.smallLoader.show();
        this.getTrending();
    }

    public onClearForm():void {
        //this.selectedEventOrder = this.eventOrder[0];
        this.selectedEventFilter = this.eventFilter[0];
        this.markers = [];
        this.events = [];
        this.priceRange = [0, 50]
        this.selected = false;
        this.showDate = false;
        this.showPrice = false;
        this.smallLoader.show();
        this.params.limit = 10;
        this.params.tid = '';
        this.params.date = '';
        this.params.weekend = '';
        this.params.radius = (this.currentRadius / 1000);
        this.params.price = '';
        this.params.order = '';
        this.getTrending();
    }

    public onSelectEventFilter(filter:any):void {
        this.selectedEventFilter = filter;
        let date = new Date();
        if (filter.name == 'today') {
            this.params.date = moment(date).format('YYYY-MM-DD');
        }
        if (filter.name == 'tomorrow') {
            let tomorrow = date.setDate(date.getDate() + 1);
            this.params.date = moment(date).format('YYYY-MM-DD');
        }
        if (filter.name == 'this week') {
            this.params.weekend = 1;
            this.params.date = '';
        }
        if (filter.name == 'all') {
            this.params.weekend = 0;
            this.params.date = '';
        }

        if (this.selectedEventOrder.name == 'top 100') {
            this.showCircle = false;
        } else {
            this.showCircle = true;
        }
        this.markers = [];
        this.events = [];
        this.smallLoader.show();
        this.getTrending();
    }

    public onSelectEventOrder(order:any):void {
        this.selectedEventOrder = order;
        if (order.name == 'top 100') {
            this.params.limit = 100;
            this.showCircle = false;
        } else {
            this.showCircle = true;
            this.params.latest = 1;
        }
        this.markers = [];
        this.events = [];
        this.smallLoader.show();
        this.getTrending();
    }

    public onClickLike(item:any) {
        item.user_bookmark = !item.user_bookmark;
        console.log(item);
        let param = {
            'slug': item.alias
        };
        this.smallLoader.show();
        this.homeService.likeEvent(param).map(res=>res.json()).subscribe(res=> {
            this.loaderService.hide();
            this.alertType = 'success';
            this.msgContent = res.message;
        }, err=> {
            if (err.status == 403) {
                this.loaderService.hide();
                this.route.navigate(['login']);
            } else {
                this.smallLoader.hide();
                this.alertType = 'error';
                this.msgContent = 'Sorry, bookmark error please try again';
            }
        });

    }

    public clickedMarker(selector, horizontal) {
        const element = document.querySelector('#v' + selector);
        element.scrollIntoView(true);
        scrollTo(
            '#v' + selector,
            '#v-scrollable',
            horizontal,
            100
        );
    }

    public selectedDate(value:any) {
        this.markers = [];
        this.events = [];
        this.params.when = [moment(value.start).format('YYYY-MM-DD'), moment(value.end).format('YYYY-MM-DD')];
        this.smallLoader.show();
        this.getTrending();
    }

    private getTrending() {
        let params = this.params;
        if (this.selectedEventOrder.name == 'top 100') {
            this.homeService.getTop100(this.params).map(resp=>resp.json()).subscribe(resp=> {
                this.total = resp.total;
                this.events = this.events.concat(resp.data);
                this.passerTop100(resp.data);
                this.loadMore = false;
                this.loaderService.hide();
                this.smallLoader.hide();

            }, err=> {
                this.listItems = [];
                this.events = [];
                this.markers = [];
                this.loadMore = false;
                this.loaderService.hide();
                this.smallLoader.hide();
            })
        } else {
            this.homeService.getEvents(params).map(response=>response.json()).subscribe(response=> {
                if (this.loadMore) {
                    this.events = this.events.concat(response.data);
                } else {
                    this.events = response.data;
                }
                this.total = response.total;
                this.passerTrending(response.geo);
                this.loadMore = false;
                this.loaderService.hide();
                this.smallLoader.hide();
            }, err=> {
                this.listItems = [];
                this.events = [];
                this.markers = [];
                this.loadMore = false;
                this.loaderService.hide();
                this.smallLoader.hide();
            });
        }
    }

    public options:any = {
        locale: {format: 'YYYY-MM-DD'},
        alwaysShowCalendars: false,
    };

    public mapClicked($event:MouseEvent, idElement) {
        console.log($event, idElement);
    }

    public markerRadiusChange(radius) {
        this.smallLoader.show();
        console.log(this.currentRadius, radius);
        if (this.currentRadius <= radius) {
            console.log(1);
            this.mapZoom = 10;
        } else {
            console.log(2);
            this.mapZoom = 15;
        }
        this.currentRadius = radius;
        this.params.radius = (radius / 1000);
        this.getTrending();
    }

    private getTrandingCategories() {
        this.homeService.getCategories('event').map(resp=>resp.json()).subscribe(resp=> {
            this.drawCategories = resp.data;
            console.log(resp.data);
            let number = Math.floor(this.screenWidth / 55) - 1;
            if (this.screenWidth <= 768) {
                if (resp.data.length >= number) {
                    this.categories = resp.data.slice(0, number - 1);
                } else {
                    this.categories = resp.data;
                }
            } else {

                if (this.drawCategories.length > number) {
                    this.categories = this.drawCategories.slice(0, 6);
                } else {
                    this.categories = this.drawCategories.slice(0, 6);
                }

            }

        });
    }

    public showAllCategory(e) {
        if (e) {
            this.showAll = false;
            this.categories = this.drawCategories;
        } else {
            this.showAll = true;
            let number = Math.floor(this.screenWidth / 55) - 1;
            if (this.screenWidth <= 768) {
                if (this.drawCategories.length > number) {
                    this.categories = this.drawCategories.slice(0, number - 1);
                } else {
                    this.categories = this.drawCategories;
                }
            } else {


                if (this.drawCategories.length > number) {
                    this.categories = this.drawCategories.slice(0, 6);
                } else {
                    this.categories = this.drawCategories.slice(0, 6);

                }

            }
            console.log(this.categories);
        }
        console.log(e);
    }

    public onChangePrice(value) {
        this.markers = [];
        this.events = [];
        this.params.price = this.priceRange.join(',');
        this.params.type = 'event';
        this.smallLoader.show();
        this.getTrending();
    }

    @HostListener("window:scroll", [])
    onWindowScroll() {

        let baseHeight = this.document.body.clientHeight;
        let realScrollTop = this.document.body.scrollTop + baseHeight;
        let currentHeight:number = baseHeight;
        let content_element = this.document.body.getElementsByClassName('v-scrollable')[0].children;

        if (content_element.length > 1) {
            for (let i = 0; i < content_element.length; i++) {
                let currentClientH = content_element[i].clientHeight;
                currentHeight += currentClientH;
                console.log(currentHeight);
                if (currentHeight - currentClientH <= realScrollTop && realScrollTop <= currentHeight) {
                    if (this.currentHighlightedMarker !== i) {
                        this.currentHighlightedMarker = i;
                        this.highlightMarker(i);
                    }
                }
            }
        }


        //load more
        let windowHeight = 'innerHeight' in window ? window.innerHeight
            : this.document.documentElement.offsetHeight;
        let body = this.document.body;
        let html = this.document.documentElement;
        let docHeight = Math.max(body.scrollHeight,
            body.offsetHeight, html.clientHeight,
            html.scrollHeight, html.offsetHeight);
        let windowBottom = windowHeight + window.pageYOffset;
        console.log(docHeight, windowBottom);
        //if (docHeight >= windowBottom) {
        //    if (this.selectedEventOrder.name == 'top 100') {
        //        if (this.total >= this.events.length) {
        //            // check limit start
        //            if (this.params.start >= 80) {
        //                return false;
        //            }
        //            //check limit length data response
        //            if (this.events.length < this.params.start) {
        //                return false;
        //            }
        //            this.smallLoader.show();
        //            this.loadMore = true;
        //            this.params.start += 20;
        //            console.log(this.params.start);
        //            this.getTrending();
        //        } else {
        //            this.loadMore = true;
        //            if (this.total > this.events.length) {
        //                this.smallLoader.show();
        //                this.params.page += 1;
        //                this.getTrending();
        //            }
        //        }
        //    }
        //}
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

    public markerDragEnd(event) {
        this.markers = [];
        this.lat = event.coords.lat;
        this.lng = event.coords.lng;
        this.params.lat = event.coords.lat;
        this.params.long = event.coords.lng;
        this.smallLoader.show();
        this.getTrending();
    }

    private passerTrending(geo:any) {
        this.resetData();
        this.mapsAPILoader.load().then(()=> {

            let mapCenter = new google.maps.Marker({
                position: new google.maps.LatLng(this.lat, this.lng),
                draggable: true
            });
            let searchCenter = mapCenter.getPosition();
            for (let i = 0; i < geo.length; i++) {
                for (let item of geo[i]) {
                    let latlng = item.split(',');
                    let myMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(latlng[0], latlng[1]),
                        draggable: true
                    });
                    let geometry = google.maps.geometry.spherical.computeDistanceBetween(myMarker.getPosition(), searchCenter);
                    if (parseInt(geometry) < this.currentRadius) {
                        this.markers.push({
                            lat: parseFloat(latlng[0]),
                            lng: parseFloat(latlng[1]),
                            label: '',
                            opacity: 0.6,
                            isOpenInfo: false
                        });
                    }
                }
            }
        });
    }


    private passerTop100(events:any) {
        this.mapsAPILoader.load().then(()=> {
                for (let i = 0; i < events.length; i++) {
                    let latitude:any;
                    let longitude:any;
                    if (events[i].type == 'event') {
                        if (typeof events[i].field_location_place.field_latitude !== null) {
                            latitude = events[i].field_location_place.field_latitude;
                        }

                        if (typeof events[i].field_location_place.field_longitude != null) {
                            longitude = events[i].field_location_place.field_longitude;
                        }
                    }
                    if (events[i].type == 'article') {
                        if (events[i].field_location_place.length > 0) {

                            if (typeof events[i].field_location_place[0].field_latitude != null) {
                                latitude = events[i].field_location_place[0].field_latitude;
                            }
                            if (typeof events[i].field_location_place[0].field_longitude != null) {
                                longitude = events[i].field_location_place[0].field_longitude;
                            }
                        }

                    }
                    this.markers.push({
                        lat: latitude,
                        lng: longitude,
                        label: events[i].title,
                        opacity: 0.6,
                        isOpenInfo: false
                    });


                }
            }
        );
    }

    private resetData() {
        this.markers = [];
    }

    public showRagePrice() {
        this.showPrice = true;
        this.showDate = false;
    }

    public showWhen() {
        this.showDate = true;
        this.showPrice = false;
    }

    public openPopupMention() {

    }

}
