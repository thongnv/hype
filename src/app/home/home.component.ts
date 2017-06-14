import {
    Component,
    OnInit
} from '@angular/core';
import { MainService } from '../services/main.service';
import { EventType } from '../app.interface';
import {HomeService} from "../services/home.service";
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
const MARKER_ICON = '/assets/icon/icon_pointer.png';
import * as moment from 'moment/moment';
import {any} from "codelyzer/util/function";
import { Ng2ScrollableDirective } from 'ng2-scrollable';
import { scrollTo } from 'ng2-utils';
import {LoaderService} from "../shared/loader/loader.service";
import {MapsAPILoader} from "angular2-google-maps/core/services/maps-api-loader/maps-api-loader";
import { Router } from '@angular/router';
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
    public selected:any;
    public tabActive:boolean = false;
    public isOpen:boolean = false;
    public currentHighlightedMarker:number = 1;
    public alertType:any = '';
    public msgContent:any = '';
    public  alertType:string;
    public showAll:boolean = true;
    private params:any = {
        'page': 0,
        'limit': 10,
        'filter': 'all',
        'order': 'top 100',
        'cate': '',
        'w_start': '',
        'w_end': '',
        'type': '',
        'lat': '',
        'lng': '',
        'radius': this.currentRadius,
        'price': ''
    }
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
        this.showMap = false;
        this.selected = event.tid;
        this.params.cate = event.tid;
        this.params.type = 'event';
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
        this.params.filter = '';
        this.params.limit = 10;
        this.params.cate = '';
        this.params.w_end = '';
        this.params.w_start = '';
        this.params.radius = 5000;
        this.params.price = '';
        this.params.type = '';
        this.params.order = '';
        this.getTrending();
    }

    public onSelectEventFilter(filter:any):void {
        this.selectedEventFilter = filter;
        this.params.filter = filter.name;
        this.showMap = false;
        this.loaderService.show();
        this.getTrending();
    }

    public onSelectEventOrder(order:any):void {
        this.selectedEventOrder = order;
        this.params.order = order.name;
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
        this.homeService.likeEvent(param).map(res=>res.json()).subscribe(res=> {
            this.alertType = 'success';
            this.msgContent = res.message;
        }, err=> {
            if (err.status == 403) {
                this.route.navigate(['login']);
            } else {
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
        this.params.filter = 'when';
        this.params.w_start = moment(value.start).unix() * 1000;
        this.params.w_end = moment(value.end).unix() * 1000;
        this.showMap = false;
        this.loaderService.show();
        this.getTrending();
    }

    private getTrending() {
        let params = this.params;
        console.log(params);
        this.homeService.getEvents(params).map(response=>response.json()).subscribe(response=> {
            this.listItems = response.data;
            this.loaderService.hide();
            this.loadMap();
        });
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
        this.params.radius = radius;
        this.showMap = false;
        this.loaderService.show();
        this.getTrending();
    }


    private getTrandingCategories() {
        this.homeService.getCategories('event').map(resp=>resp.json()).subscribe(resp=> {
            this.drawCategories = resp.data;
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
            this.categories= this.drawCategories.slice(0,7);
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
        if (elm.clientHeight + elm.scrollTop + elm.clientTop === elm.scrollHeight) {

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
        console.log(this.markers);
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

    private loadMap() {
        this.resetData();
        this.mapsAPILoader.load().then(()=> {
            let mapCenter = new google.maps.Marker({
                position: new google.maps.LatLng(this.lat, this.lng),
                draggable: true
            });
            let searchCenter = mapCenter.getPosition();
            for (var i = 0; i < this.listItems.length; i++) {
                if (typeof this.listItems[i].field_location_place.length === "undefined") {
                    let EMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(this.listItems[i].field_location_place.field_latitude, this.listItems[i].field_location_place.field_longitude),
                        draggable: true
                    });
                    let egeometry = google.maps.geometry.spherical.computeDistanceBetween(EMarker.getPosition(), searchCenter);
                    if (parseInt(egeometry) < this.currentRadius) {
                        this.events.push(this.listItems[i]);
                        this.markers.push({
                            lat: this.listItems[i].field_location_place.field_latitude,
                            lng: this.listItems[i].field_location_place.field_longitude,
                            label: this.listItems[i].title,
                            opacity: 0.6,
                            isOpenInfo: false
                        });
                    }
                }
                else {
                    if (this.listItems[i].field_location_place[0].field_latitude) {
                        let AMarker = new google.maps.Marker({
                            position: new google.maps.LatLng(this.listItems[i].field_location_place[0].field_latitude, this.listItems[i].field_location_place[0].field_longitude),
                            draggable: true
                        });

                        let egeometry = google.maps.geometry.spherical.computeDistanceBetween(AMarker.getPosition(), searchCenter);
                        if (parseInt(egeometry) < this.currentRadius) {
                            this.events.push(this.listItems[i]);
                            this.markers.push({
                                lat: this.listItems[i].field_location_place[0].field_latitude,
                                lng: this.listItems[i].field_location_place[0].field_longitude,
                                label: this.listItems[i].title,
                                opacity: 0.6,
                                isOpenInfo: false
                            });
                        }
                    }

                }

            }
            this.loaderService.hide();
            console.log(this.markers);
            this.showMap = true;
        });
    }

    private resetData() {
        this.markers = [];
        this.events = [];
    }

    public showPrice:boolean = false;
    public showDate:boolean = false;

    public showRagePrice() {
        this.showPrice = true;
        this.showDate = false;
    }

    public showWhen() {
        this.showDate = true;
        this.showPrice = false;
    }
}
