import { Component, EventEmitter,OnInit,Input, Output,NgZone} from '@angular/core';
import { } from '@types/googlemaps';
import { MapsAPILoader } from "angular2-google-maps/core";
declare let google:any;
@Component({
    selector: 'gmap-geocode-marker',
    templateUrl: './gmap-geocode-marker.html',
})
export class GeocodeMarkerComponent implements OnInit {


    @Input('events') public inputEvents:any;
    @Input('lat') public lat:any;
    @Input('lng') public lng:any;
    @Input('currentRadius') public currentRadius:any;
    @Output('radiusChange') public radiusChange = new EventEmitter<any>();
    @Output('dragEnd') public dragEnd = new EventEmitter<any>();
    @Output() public eventsSearch = new EventEmitter();
    public markers:any = [];
    public events:any[];
    public MARKER_ICON = '/assets/icon/icon_pointer.png';

    public constructor(private mapsAPILoader:MapsAPILoader, private ngZone:NgZone) {


    }

    public ngOnInit() {
        this.loadMapRadius();
        this.eventsSearch.emit(this.events);
    }

    public markerRadiusChange(radius) {
        this.currentRadius = parseInt(radius);
        this.radiusChange.emit(this.currentRadius);
    }

    public clickedMarker($event) {

    }

    public markerDragEnd($event) {
        if ($event.coords) {
            this.lat = $event.coords.lat;
            this.lng = $event.coords.lng;
            this.dragEnd.emit($event);
        }
    }

    private loadMapRadius() {

        this.mapsAPILoader.load().then(()=> {
            let mapCenter = new google.maps.Marker({
                position: new google.maps.LatLng(this.lat, this.lng),
                draggable: true
            });
            let searchCenter = mapCenter.getPosition();
            for (var i = 0; i < this.inputEvents.length; i++) {
            //    let myMarker = new google.maps.Marker({
            //        position: new google.maps.LatLng(this.inputEvents[i].field_location_place.field_latitude, this.inputEvents[i].field_location_place.field_longitude),
            //        draggable: true
            //    });
            //    let geometry = google.maps.geometry.spherical.computeDistanceBetween(myMarker.getPosition(), searchCenter);
            //    if (parseInt(geometry) < this.currentRadius) {
            //        this.events.push(this.inputEvents[i]);
                    this.markers.push({
                        lat: this.inputEvents[i].field_location_place.field_latitude,
                        lng: this.inputEvents[i].field_location_place.field_longitude,
                        label: this.inputEvents[i].title
                    });
            //    }
            //
            }
        });
    }
    public infoWindowClose($event){
        console.log($event);
    }

}
