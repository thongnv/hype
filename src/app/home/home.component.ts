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
    public eventType:EventType[] = [];
    public selectedEventType:EventType;
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
    public priceRange:number[] = [50, 300];

    private params:any = {
        'page': 0,
        'limit': 10,
        'filter': 'all',
        'order': 'top 100',
        'cate': '',
        'w_start': '',
        'w_end': ''
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
    }

    public onSelectEventType(id:number):void {
        this.eventType[id].selected = !this.eventType[id].selected;
        if (this.eventType[id].selected && this.eventType[id].name.toLowerCase() === 'all') {
            this.eventType.forEach((event, index) => {
                this.eventType[index].selected = false;
            });
            this.eventType[id].selected = true;
        } else {
            this.eventType.forEach((event, index) => {
                if (this.eventType[index].name.toLowerCase() === 'all') {
                    this.eventType[index].selected = false;
                }
            });
        }
        this.getTrending();
    }

    public onClearForm():void {
        this.selectedEventOrder = this.eventOrder[0];
        this.selectedEventFilter = this.eventFilter[0];
        this.eventType.forEach((event, index) => {
            if (this.eventType[index].name.toLowerCase() === 'all') {
                this.eventType[index].selected = true;
            } else {
                this.eventType[index].selected = false;
            }
        });
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
        item.selected = !item.selected;
        console.log('LIKE: ', item);
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

}
