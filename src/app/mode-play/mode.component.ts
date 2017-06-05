import { Component, OnInit,ViewEncapsulation,NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap'
import {ModeService} from "../services/mode.service";
import {PolyMouseEvent} from "angular2-google-maps/core/services/google-maps-types";
import {LatLngBounds} from "angular2-google-maps/core/services/google-maps-types";
import {GoogleMapsAPIWrapper} from "angular2-google-maps/core/services/google-maps-api-wrapper";
import {MapsAPILoader} from "angular2-google-maps/esm/core/services/maps-api-loader/maps-api-loader";
import {SebmGoogleMap} from "angular2-google-maps/esm/core/directives/google-map";

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

    public markers:any;
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
    public mapZoom:number = 12;
    public lat:number = 21.030596;
    public lng:number = 105.786215;
    public searchCenter = {lat: this.lat, lng: this.lng};

    public constructor(private formBuilder:FormBuilder,
                       private modeService:ModeService,
                       private rateConfig:NgbRatingConfig,private wrapper: GoogleMapsAPIWrapper) {

        this.filterFromMode = this.formBuilder.group({
            filterMode: 'all'
        });

        this.filterCategory = this.formBuilder.group({
            filterCategory: 'all'
        });

        this.rateConfig.max = 5;
        this.rateConfig.readonly = false;


    }

    public ngOnInit() {
        this.getCategories();
        this.getDataModes();
        this.getFilter();

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

    onChange(value:number) {
        this.someValue = this.someValue + value;
    }

    getDataModes() {
        this.modeService.getModes(this.params).map(response => response.json())
            .subscribe(data => this.items = data);
    }

    getCategories() {
        if (this.filterFromMode.getRawValue().filterMode == 'all') {
            this.params.type = 'eat';
        }
        else {
            this.params.type = this.filterFromMode.getRawValue().filterMode;
        }
        console.log(this.params);
        this.modeService.getCategories(this.params).map(resp=>resp.json()).subscribe((resp)=> {
            this.categories = resp;
        });
    }

    getFilter() {
        this.modeService.getFilterMode().map(resp=>resp.json()).subscribe((resp)=> {
            this.filterData = resp;
        });
    }

    markerDragEnd($event:MouseEvent) {
        console.log('dragEnd', $event);
        //Update center map
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;


    }

    markerRadiusChange(event) {
        console.log("Radius Change", event);
        let radius = parseInt(event, 10) * 5000;
        console.log(radius);
        var bounds = new google.maps.LatLngBounds();

        let searchCenter = new google.maps.LatLng(this.lat, this.lng);
        console.log(searchCenter);
        for (var i = 0; i < this.markers.length; i++) {
            if (google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.markers[i].lat, this.markers[i].lng), searchCenter) < radius) {
                bounds.extend(new google.maps.LatLng(this.markers[i].lat, this.markers[i].lng));
            }
        }
        console.log(bounds);
    }

    clickedMarker(label:string, index:number) {
        console.log(`clicked the marker: ${label || index}`)
    }

    mapClicked($event:MouseEvent) {
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