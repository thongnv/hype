import { Component, OnInit,ViewEncapsulation,NgZone,AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap'
import {ModeService} from "../services/mode.service";
import {GoogleMapsAPIWrapper} from "angular2-google-maps/core/services/google-maps-api-wrapper";

declare let google:any;

interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}

@Component({
    moduleId: "hylo-mode",
    selector: 'app-mode',
    templateUrl: './mode.component.html',
    styleUrls: ['./mode.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [NgbRatingConfig]
})


export class ModeComponent implements OnInit {
    public markers:any = [];
    public categories:any = [];
    public someValue:number = 5;
    public someRange3:number[] = [50, 300];
    public filterFromMode:FormGroup;
    public filterCategory:FormGroup;
    params:{type:string} = {type: 'eat'};
    public items = [];
    public filterData:any = [];
    public currentRate = 3;
    public cuisine = [{}];
    public latlngBounds:any;
    public mapZoom:number = 10;
    public lat:number = 21.030596;
    public lng:number = 105.786215;
    public currentRadius:any = 3000;

    public constructor(private formBuilder:FormBuilder,
                       private modeService:ModeService,
                       private rateConfig:NgbRatingConfig, private wrapper:GoogleMapsAPIWrapper) {

        this.filterFromMode = this.formBuilder.group({
            filterMode: 'all'
        });

        this.filterCategory = this.formBuilder.group({
            filterCategory: 'all'
        });

        this.rateConfig.max = 5;
        this.rateConfig.readonly = false;

        this.markers = [
            {lat: 21.033933, lng: 105.786635},
            {lat: 21.033492, lng: 105.793051},
            {lat: 21.038319, lng: 105.821257},
            {lat: 21.023623485099524, lng: 105.699462890625},
            {lat: 20.99574010656533, lng: 105.6991195678711},
            {lat: 20.976186585026024, lng: 105.80657958984375},
            {lat: 20.937071867747825, lng: 105.6005859375}
        ];
    }

    public ngOnInit() {
        this.getCategories(this.filterFromMode.value.filterMode);
        this.getDataModes();
        this.getFilter();
        // this.renderMaker(5000);
    }

    onChange(value:number) {
        this.someValue = this.someValue + value;
    }

    getDataModes() {
        // this.modeService.getModes(this.params).map(response => response.json())
        //     .subscribe(data => this.items = data);data
    }

    getCategories(value) {
            this.modeService.getCategories(value).map(resp=>resp.json()).subscribe((resp)=> {
            this.categories = resp;
        });

    }

    getFilter() {
        this.modeService.getFilterMode().map(resp=>resp.json()).subscribe((resp)=> {
            this.filterData = resp;
        });
    }


    markerDragEnd($event) {
        if($event.coords) {
            console.log('dragEnd', $event);
            //Update center map
            this.lat = $event.coords.lat;
            this.lng = $event.coords.lng;
        }
    }

    markerRadiusChange(event) {
        console.log("Radius Change", event);
        let radius = parseInt(event);
        //this.renderMaker();
    }

    clickedMarker(label:string, index:number) {
        console.log(`clicked the marker: ${label || index}`)
    }

    mapClicked($event) {
        if($event.coords) {
            console.log({
                latitude: $event.coords.lat,
                longitude: $event.coords.lng,
            });
            this.markers.push({
                lat: $event.coords.lat,
                lng: $event.coords.lng,
                draggable: false
            });
        }
    }
    changeCategory(){
        this.getCategories(this.filterFromMode.value.filterMode);
    }
    private renderMaker() {

    }
}