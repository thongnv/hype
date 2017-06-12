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
    public markers:any = [];
    public MARKER_ICON = '/assets/icon/icon_pointer.png';
    public constructor(private mapsAPILoader:MapsAPILoader, private ngZone:NgZone) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=> {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            });
        } else {
            this.lat = 0;
            this.lng = 0;
        }
        console.log('a');
    }

    public ngOnInit() {
        console.log('a');
        this.mapsAPILoader.load().then(()=> {
            let mapCenter = new google.maps.Marker({
                position: new google.maps.LatLng(this.lat, this.lng),
                draggable: true
            });
            let searchCenter = mapCenter.getPosition();
            for (var i = 0; i < this.inputEvents.length; i++) {
                let myMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(this.inputEvents[i].field_location_place.field_latitude, this.inputEvents[i].field_location_place.field_longitude),
                    draggable: true
                });
                let geometry = google.maps.geometry.spherical.computeDistanceBetween(myMarker.getPosition(), searchCenter);
                console.log(parseInt(geometry), parseInt(this.currentRadius));
                if (parseInt(geometry) < this.currentRadius) {
                    this.markers.push({
                        lat: this.inputEvents[i].field_location_place.field_latitude,
                        lng: this.inputEvents[i].field_location_place.field_longitude,
                        label: this.inputEvents[i].title
                    });
                    console.log(this.markers);
                }

            }
        });

    }

    public markerRadiusChange(radius) {

        let mapCenter = new google.maps.Marker({
            position: new google.maps.LatLng(this.lat, this.lng),
            draggable: true
        });
        let searchCenter = mapCenter.getPosition();
        for (var i = 0; i < this.inputEvents.length; i++) {
            let myMarker = new google.maps.Marker({
                position: new google.maps.LatLng(this.inputEvents[i].field_location_place.field_latitude, this.inputEvents[i].field_location_place.field_longitude),
                draggable: true
            });

            let geometry = google.maps.geometry.spherical.computeDistanceBetween(myMarker.getPosition(), searchCenter);
            console.log(parseInt(geometry), parseInt(radius));
            if (parseInt(geometry) < parseInt(radius)) {
                this.markers.push({
                    lat: this.inputEvents[i].field_location_place.field_latitude,
                    lng: this.inputEvents[i].field_location_place.field_longitude,
                    label: this.inputEvents[i].title
                });
                console.log(this.markers);
            } else {
                this.markers = [];
            }
        }

        this.currentRadius = parseInt(radius);
        this.radiusChange.emit(this.currentRadius);
    }

    public clickedMarker() {

    }

    public markerDragEnd($event) {
        if ($event.coords) {
            this.lat = $event.coords.lat;
            this.lng = $event.coords.lng;

            let mapCenter = new google.maps.Marker({
                position: new google.maps.LatLng(this.lat, this.lng),
                draggable: true
            });
            let searchCenter = mapCenter.getPosition();
            for (var i = 0; i < this.inputEvents.length; i++) {
                let myMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(this.inputEvents[i].field_location_place.field_latitude, this.inputEvents[i].field_location_place.field_longitude),
                    draggable: true
                });
                let geometry = google.maps.geometry.spherical.computeDistanceBetween(myMarker.getPosition(), searchCenter);
                console.log(parseInt(geometry), parseInt(this.currentRadius));
                if (parseInt(geometry) < parseInt(this.currentRadius)) {
                    this.markers.push({
                        lat: this.inputEvents[i].field_location_place.field_latitude,
                        lng: this.inputEvents[i].field_location_place.field_longitude,
                        label: this.inputEvents[i].title
                    });
                    console.log(this.markers);
                } else {
                    this.markers = [];
                }
            }
        }
    }
}
