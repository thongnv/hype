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
const MARKER_ICON_SELECTED = '/assets/icon/icon_pointer_selected.png';

const now = new Date();

@Component({
    selector: 'home',
    providers: [],
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
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

    public markerClick(id:any) {
        console.log('index: ', id);
        this.markers.forEach((marker) => {
            if (marker.parent === id) {
                marker.isOpen = true;
                marker.icon = MARKER_ICON_SELECTED;
            } else {
                if (marker.isOpen === true) {
                    marker.isOpen = false;
                }
                if (marker.icon === MARKER_ICON_SELECTED) {
                    marker.icon = MARKER_ICON;
                }
            }
        });
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

    public mapClicked($event:MouseEvent) {

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
