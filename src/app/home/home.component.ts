// core
import {Component, OnInit,HostListener,ViewChild,Inject} from '@angular/core';
import { Router } from '@angular/router';

// 3rd libs
import * as moment from 'moment/moment';
import { Location } from '@angular/common';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {any} from "codelyzer/util/function";
import { Ng2ScrollableDirective } from 'ng2-scrollable';
import { scrollTo } from 'ng2-utils';
import {MapsAPILoader} from "angular2-google-maps/core/services/maps-api-loader/maps-api-loader";
import { DOCUMENT } from "@angular/platform-browser";
import $ from "jquery";

// services
import { MainService } from '../services/main.service';
import {HomeService} from "../services/home.service";
import {LoaderService} from "../helper/loader/loader.service";

// models
import { EventType } from '../app.interface';

// components
import {EventItemComponent} from '../event/event-item/event-item.component';
import { AppSetting } from '../app.setting';
import {of} from "rxjs/observable/of";
import {SmallLoaderService} from "../helper/small-loader/small-loader.service";
import { LocalStorageService } from "angular-2-local-storage";

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
    private end_record:boolean = false;
    public screenWidth:number = 0;
    public screenHeight:number = 0;
    public circleDraggable:boolean = true;
    private stopped:boolean = false;
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
                private localStorageService:LocalStorageService,
                private route:Router,
                private location:Location,
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
        //var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        let paramsUrl = this.location.path().split('/');
        $("body").bind("DOMMouseScroll mousewheel", ()=> {
            $(window).scroll(()=> {
                //load more data
                if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                    if (this.selectedEventOrder.name == 'top 100') {
                        if (this.loadMore == false && this.end_record == false) {
                            if (this.events.length > 10) {
                                this.loadMore = true;
                                this.params.start += 20;
                                this.smallLoader.show();
                                this.getTrending();
                            }
                        }

                    } else {
                        if (this.loadMore == false && this.end_record == false) {
                            if (this.events.length > 10) {
                                this.loadMore = true;
                                this.smallLoader.show();
                                this.params.page++;
                                this.getTrending();
                            }
                        }

                    }
                }

                //index marker Highlight
                if(this.stopped){
                    return false;
                }
                if (paramsUrl[1] == "home" && $("#v-scrollable").length) {
                    let baseHeight = $("#v-scrollable")[0].clientHeight;
                    let realScrollTop = $(window).scrollTop() + baseHeight;
                    let currentHeight:number = baseHeight;
                    let content_element = $("#v-scrollable")[0].children;
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
        this.listItems = [];
        this.params.page = 0;
        this.smallLoader.show();
        this.getTrending();
    }

    public onClearForm():void {
        //this.selectedEventOrder = this.eventOrder[0];
        this.selectedEventFilter = this.eventFilter[0];
        this.markers = [];
        this.events = [];
        this.listItems = [];
        this.priceRange = [0, 50]
        this.selected = false;
        this.showDate = false;
        this.showPrice = false;
        this.smallLoader.show();
        this.params.limit = 10;
        this.params.page = 0;
        this.params.tid = '';
        this.params.date = '';
        this.params.weekend = '';
        this.params.radius = (this.currentRadius / 1000);
        this.params.price = '';
        this.params.order = '';
        this.selected = 'all';
        this.getTrending();
    }

    public onSelectEventFilter(filter:any):void {
        this.onClearForm();
        this.selectedEventFilter = filter;
        console.log(filter);
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
        this.listItems = [];
        this.smallLoader.show();
        this.getTrending();
    }

    public onSelectEventOrder(order:any):void {
        this.selectedEventOrder = order;
        this.onClearForm();
        if (order.name == 'top 100') {
            //this.params.limit = 100;
            this.showCircle = false;
        } else {
            this.showCircle = true;
            this.params.latest = 1;
        }
        this.selected = 'all';
        this.markers = [];
        this.events = [];
        this.listItems = [];
        this.smallLoader.show();
        this.getTrending();
    }

    public onLikeEmit(item:any) {
        item.user_bookmark = !item.user_bookmark;
        let user = this.localStorageService.get('user');
        if (!user) {
            this.route.navigate(['login'], {skipLocationChange: true}).then();
        } else {
            let param = {
                slug: item.alias
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
    }

    public clickedMarker(markerId, horizontal) {
        $('html, body').animate({
            scrollTop: $("#v" + markerId).offset().top - 80
        });
        this.stopped = true;
        this.currentHighlightedMarker = markerId;
        this.highlightMarker(markerId);
    }

    public selectedDate(value:any) {
        this.onClearForm();
        this.markers = [];
        this.events = [];
        this.listItems = [];
        this.params.page = 0;
        this.params.when = [moment(value.start).format('YYYY-MM-DD'), moment(value.end).format('YYYY-MM-DD')];
        this.smallLoader.show();
        this.getTrending();
    }

    private getTrending() {
        let params = this.params;
        if (this.selectedEventOrder.name == 'top 100') {
            this.homeService.getTop100(this.params).map(resp=>resp.json()).subscribe(resp=> {
                console.log(this.events);
                this.total = resp.total;
                if (resp.data.length == 0) {
                    this.end_record = true;
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

            }, err=> {
                this.loadMore = true;
                this.end_record = true;
                this.loaderService.hide();
                this.smallLoader.hide();
            })
        } else {
            this.homeService.getEvents(params).map(response=>response.json()).subscribe(response=> {
                console.log(this.events);
                if (this.loadMore) {
                    this.events = this.events.concat(response.data);
                } else {
                    this.events = response.data;
                }
                if (response.data.length == 0) {
                    this.end_record = true;
                }
                this.total = response.total;
                this.passerTrending(response.geo);
                this.loadMore = false;
                this.loaderService.hide();
                this.smallLoader.hide();
            }, err=> {
                this.loadMore = true;
                this.end_record = true;
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
        this.onClearForm();
        this.smallLoader.show();
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
        this.params.page = 0;
        this.priceRange = value;
        this.params.price = value.join(',');
        console.log(this.params.price);
        this.params.type = 'event';
        this.smallLoader.show();
        this.getTrending();
    }

    private highlightMarker(markerId:number):void {
        if (this.markers[markerId]) {
            this.markers[markerId].opacity = 1;
            this.markers.forEach((marker, index) => {
                if (index == markerId) {
                    console.log("markerId", markerId);
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
        this.markers = [];
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

                    if ((parseInt(geometry) - 100) < this.currentRadius) {
                        if (i == 0) {
                            this.markers.push({
                                lat: parseFloat(latlng[0]),
                                lng: parseFloat(latlng[1]),
                                label: '',
                                opacity: 1,
                                isOpenInfo: true,
                                icon: 'assets/icon/icon_pointer.png'
                            });
                        } else {
                            this.markers.push({
                                lat: parseFloat(latlng[0]),
                                lng: parseFloat(latlng[1]),
                                label: '',
                                opacity: 0.4,
                                isOpenInfo: false,
                                icon: 'assets/icon/icon_pointer.png'
                            });
                        }
                    }
                }
            }
        });
    }


    private passerTop100(events:any) {
        this.currentHighlightedMarker = 0;
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
                    if (i == 0) {
                        this.markers.push({
                            lat: latitude,
                            lng: longitude,
                            label: events[i].title,
                            opacity: 1,
                            isOpenInfo: true,
                            icon: 'assets/icon/icon_pointer.png'
                        });
                    } else {
                        this.markers.push({
                            lat: latitude,
                            lng: longitude,
                            label: events[i].title,
                            opacity: 0.4,
                            isOpenInfo: false,
                            icon: 'assets/icon/icon_pointer.png'
                        });
                    }


                }
            }
        );
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
