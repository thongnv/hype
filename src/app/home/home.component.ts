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
const MARKER_ICON_SELECTED = '/assets/icon/icon_pointer_selected.png';

const now = new Date();

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
    public showMap = false;
    public lists:any[] = [];
    public markers:any[] = [];
    public mapZoom:number = 12;
    public lat:number = 1.3174364;
    public lng:number = 103.8619751;
    public currentRadius:any = 5000;
    public priceRange:number[] = [0, 50];
    public categories:any[];
    public selected:any;
    public tabActive:boolean = false;
    public isOpen:boolean = false;
    public id:any='v1';
    private params:any = {
        'page': 0,
        'limit': 10,
        'filter': 'all',
        'order': 'top 100',
        'cate': '',
        'w_start': '',
        'w_end': '',
        'type': '',
        'lat': this.lat,
        'lng': this.lng,
        'radius': this.currentRadius,
        'price': ''
    }
    private userProfile:any;

    //date picker
    model:NgbDateStruct;
    date:{year: number, month: number};

    // TypeScript public modifiers
    constructor(private mainService:MainService, private homeService:HomeService) {
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

    }

    public ngOnInit() {
        this.selectedEventOrder = this.eventOrder[0];
        this.selectedEventFilter = this.eventFilter[0];
        this.getTrending();
        this.getTrandingCategories();
    }

    public onSelectEventType(event):void {
        this.showMap = false;
        this.selected = event.tid;
        this.params.cate = event.tid;
        this.params.type = 'event';
        this.getTrending();
    }

    public onClearForm():void {
        this.selectedEventOrder = this.eventOrder[0];
        this.selectedEventFilter = this.eventFilter[0];
        this.showMap = false;
        this.selected = false;
        this.getTrending();
    }

    public onSelectEventFilter(filter:any):void {
        this.selectedEventFilter = filter;
        this.params.filter = filter.name;
        this.showMap = false;
        this.getTrending();
    }

    public onSelectEventOrder(order:any):void {
        this.selectedEventOrder = order;
        this.params.order = order.name;
        this.showMap = false;
        this.getTrending();
    }

    public onClickLike(item:any) {
        item.user_bookmark = !item.user_bookmark;
        console.log(item);
        let param = {
            'slug': item.alias
        };
        this.homeService.likeEvent(param).map(res=>res.json()).subscribe(res=> {
            console.log(res);
        });

    }

    public clickedMarker(selector, horizontal) {
        scrollTo(
            '#v'+selector,       // scroll to this
            '#v-scrollable', // scroll within (null if window scrolling)
            horizontal,     // is it horizontal scrolling
            0               // distance from top or left
        );

    }

    public selectedDate(value:any) {
        this.params.filter = 'when';
        this.params.w_start = moment(value.start).unix();
        this.params.w_end = moment(value.end).unix();
        this.showMap = false;
        this.getTrending();
    }

    private getTrending() {
        let params = this.params;
        console.log(params);
        this.homeService.getEvents(params).map(response=>response.json()).subscribe(response=> {
            this.events = response.data;
            console.log(response);
            this.showMap = true;
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

    }

    private getTrandingCategories() {
        this.homeService.getCategories('event').map(resp=>resp.json()).subscribe(resp=> {
            console.log(resp);
            this.categories = resp.data;
        });
    }

    public onChangePrice(value) {
        this.showMap = false;
        this.params.price = this.priceRange.join(',');
        this.params.type = 'event';
        this.getTrending();
    }
}
