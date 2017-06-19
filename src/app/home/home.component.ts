// core
import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

// 3rd libs
import * as moment from 'moment/moment';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {any} from "codelyzer/util/function";
import { Ng2ScrollableDirective } from 'ng2-scrollable';
import { scrollTo } from 'ng2-utils';
import {MapsAPILoader} from "angular2-google-maps/core/services/maps-api-loader/maps-api-loader";

// services
import { MainService } from '../services/main.service';
import {HomeService} from "../services/home.service";
import {LoaderService} from "../shared/loader/loader.service";

// models
import { EventType } from '../app.interface';

// components
import {EventItemComponent} from '../event/event-item/event-item.component';

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
    public localState = {value: ''};
    public eventFilter:any[] = [];
    public selectedEventFilter:any;
    public eventOrder:any[] = [];
    public selectedEventOrder:any;
    public events:any = [];
    private listItems:any[] = [];
    public showMap = false;
    public lists:any[] = [];
    public markers:any[] = [];
    public mapZoom:number = 12;
    public lat:number = 1.3089757786697331;
    public lng:number = 103.8258969783783;
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
    private params:any = {
        'page': 0,
        'limit': 10,
        'start': 0,
        'tid': '',
        'date': '',
        'latest': '',
        'weeken': '',
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
                private mapsAPILoader:MapsAPILoader,
                private route:Router) {
        this.eventFilter = [
            {name: 'all'},
            {name: 'today'},
            {name: 'tomorrow'},
            {name: 'weekend'},
        ];
        this.eventOrder = [
            {name: 'top 100'},
            {name: 'latest'},
        ];

        this.loaderService.show();

    }

    public ngOnInit() {
        this.selectedEventOrder = this.eventOrder[0];
        this.selectedEventFilter = this.eventFilter[0];
        this.selected = 'all';
        this.getTrending();
        this.getTrandingCategories();
    }

    public onSelectEventType(event):void {
        console.log(event);
        if (event == 'all') {
            this.selected = 'all';
            this.params.cate = '';
        } else {
            this.selected = event.tid;
            this.params.tid = event.tid;
        }
        this.showMap = false;
        this.loaderService.show();
        this.getTrending();
    }

    public onClearForm():void {
        this.selectedEventOrder = this.eventOrder[0];
        this.selectedEventFilter = this.eventFilter[0];
        this.showMap = false;
        this.selected = false;
        this.showDate = false;
        this.showPrice = false;
        this.loaderService.show();
        this.params.limit = 10;
        this.params.tid = '';
        this.params.date = '';
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
        if (filter.name == 'weekend') {
            this.params.weeken = 1;
            this.params.date = '';
        }
        if (filter.name == 'all') {
            this.params.weeken = 0;
            this.params.date = '';
        }
        this.showCircle = true;
        this.showMap = false;
        this.loaderService.show();
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
        this.showMap = false;
        this.loaderService.show();
        this.getTrending();
    }

    public onClickLike(item:any) {
        item.user_bookmark = !item.user_bookmark;
        console.log(item);
        let param = {
            'slug': item.alias
        };
        this.loaderService.show();
        this.homeService.likeEvent(param).map(res=>res.json()).subscribe(res=> {
            this.loaderService.hide();
            this.alertType = 'success';
            this.msgContent = res.message;
        }, err=> {
            if (err.status == 403) {
                this.route.navigate(['login']);
            } else {
                this.loaderService.hide();
                this.alertType = 'error';
                this.msgContent = 'Sorry, bookmark error please try again';
            }
        });

    }

    public clickedMarker(selector, horizontal) {
        scrollTo(
            '#v' + selector,
            '#v-scrollable',
            horizontal,
            0
        );

    }

    public selectedDate(value:any) {
        console.log(value);
        this.params.when = [moment(value.start).format('YYYY-MM-DD'), moment(value.end).format('YYYY-MM-DD')];
        this.showMap = false;
        this.loaderService.show();
        this.getTrending();
    }

    private getTrending() {
        let params = this.params;
        if (this.selectedEventOrder.name == 'top 100') {
            this.homeService.getTop100(this.params).map(resp=>resp.json()).subscribe(resp=> {
                this.total = resp.total;
                if (this.loadMore) {
                    this.listItems = this.listItems.concat(resp.data);
                } else {
                    this.listItems = resp.data;
                }
                this.loaderService.hide();
                this.passerTop100();
                this.showMap = true;

            }, err=> {
                this.listItems = [];
                this.events = [];
                this.markers = [];
                this.showMap = true;
                this.loaderService.hide();
            })
        } else {
            this.homeService.getEvents(params).map(response=>response.json()).subscribe(response=> {
                if (this.loadMore) {
                    this.listItems = this.listItems.concat(response.data);
                } else {
                    this.listItems = response.data;
                }
                this.total = response.total;
                this.loaderService.hide();
                this.passerTrending();
                this.showMap = true;
            }, err=> {
                this.listItems = [];
                this.events = [];
                this.markers = [];
                this.loaderService.hide();
                this.showMap = true;
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

        if (this.currentRadius <= radius) {
            this.mapZoom--;
        } else {
            this.mapZoom++;
        }
        this.currentRadius = radius;
        this.params.radius = (radius / 1000);
        this.showMap = false;
        this.loaderService.show();
        this.getTrending();
    }

    private getTrandingCategories() {
        this.homeService.getCategories('event').map(resp=>resp.json()).subscribe(resp=> {
            this.drawCategories = resp.data;
            console.log(resp.data);
            if (resp.data.length >= 8) {
                this.categories = resp.data.slice(0, 7);
            }

        });
    }

    public showAllCategory(e) {
        if (e) {
            this.showAll = false;
            this.categories = this.drawCategories;
        } else {
            this.showAll = true;
            this.categories = this.drawCategories.slice(0, 7);
            console.log(this.categories);
        }
        console.log(e);
    }

    public onChangePrice(value) {
        this.showMap = false;
        this.params.price = this.priceRange.join(',');
        this.params.type = 'event';
        this.loaderService.show();
        this.getTrending();
    }

    public onScroll(event) {
        let elm = event.srcElement;
        let baseHeight = event.target.clientHeight;
        let realScrollTop = event.target.scrollTop + baseHeight;
        let currentHeight:number = baseHeight;

        // determine just scrolled to end
        if (elm.clientHeight + elm.scrollTop + elm.clientTop === elm.scrollHeight) {
            console.log('end, params: ', this.params);
            this.loaderService.show();
            if (this.selectedEventOrder.name == 'top 100') {
                if (this.total <= 20) {
                    this.loadMore = true;
                    this.params.start += 20;
                    this.getTrending();
                }

            } else {
                this.loadMore = true;
                if (this.total > this.listItems.length) {
                    this.params.page += 1;
                    this.getTrending();
                }
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

    public markerDragEnd(event) {
        console.log(event);
        this.showMap = false;
        this.lat = event.coords.lat;
        this.lng = event.coords.lng;
        this.params.lat = event.coords.lat;
        this.params.lng = event.coords.lng;
        this.loaderService.show();
        this.getTrending();
    }

    private passerTrending() {
        this.resetData();
        this.mapsAPILoader.load().then(()=> {
                let mapCenter = new google.maps.Marker({
                    position: new google.maps.LatLng(this.lat, this.lng),
                    draggable: true
                });
                let searchCenter = mapCenter.getPosition();

                for (let i = 0; i < this.listItems.length; i++) {
                    if (this.listItems[i].field_location_place.length != 0 ||
                        this.listItems[i].field_location_place.field_latitude != null) {
                        let latitude = (this.listItems[i].field_location_place.field_latitude) ? this.listItems[i].field_location_place.field_latitude : this.listItems[i].field_location_place[0].field_latitude;
                        let longitude = (this.listItems[i].field_location_place.field_longitude) ? this.listItems[i].field_location_place.field_longitude : this.listItems[i].field_location_place[0].field_longitude;
                        if (typeof this.listItems[i].field_location_place.length != 0 ||
                            typeof this.listItems[i].field_location_place.field_latitude != 'undefined') {
                            let latitude = (this.listItems[i].field_location_place.field_latitude) ? this.listItems[i].field_location_place.field_latitude : this.listItems[i].field_location_place[0].field_latitude;
                            let longitude = (this.listItems[i].field_location_place.field_longitude) ? this.listItems[i].field_location_place.field_longitude : this.listItems[i].field_location_place[0].field_longitude;

                            let GMarker = new google.maps.Marker({
                                position: new google.maps.LatLng(latitude, longitude),
                                draggable: true
                            });
                            let geometry = google.maps.geometry.spherical.computeDistanceBetween(GMarker.getPosition(), searchCenter);
                            if (parseInt(geometry) < this.currentRadius) {
                                this.events.push(this.listItems[i]);
                                this.markers.push({
                                    lat: latitude,
                                    lng: longitude,
                                    label: this.listItems[i].title,
                                    opacity: 0.6,
                                    isOpenInfo: false
                                });
                            }
                        }
                    }
                }
                this.loaderService.hide();
                this.showMap = true;
            }
        );
    }

    private passerTop100() {
        this.resetData();
        this.mapsAPILoader.load().then(()=> {

                for (let i = 0; i < this.listItems.length; i++) {

                    let latitude = (this.listItems[i].field_location_place.field_latitude) ? this.listItems[i].field_location_place.field_latitude : this.listItems[i].field_location_place[0].field_latitude;
                    let longitude = (this.listItems[i].field_location_place.field_longitude) ? this.listItems[i].field_location_place.field_longitude : this.listItems[i].field_location_place[0].field_longitude;

                    //let GMarker = new google.maps.Marker({
                    //    position: new google.maps.LatLng(latitude, longitude),
                    //    draggable: true
                    //});
                    //let geometry = google.maps.geometry.spherical.computeDistanceBetween(GMarker.getPosition(), searchCenter);
                    //if (parseInt(geometry) < this.currentRadius) {
                    this.events.push(this.listItems[i]);
                    this.markers.push({
                        lat: latitude,
                        lng: longitude,
                        label: this.listItems[i].title,
                        opacity: 0.6,
                        isOpenInfo: false
                    });


                }
                this.loaderService.hide();
                this.showMap = true;
            }
        );
    }

    private resetData() {
        this.markers = [];
        this.events = [];
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
