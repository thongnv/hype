import { Component, EventEmitter,OnInit,Input, Output,NgZone} from '@angular/core';
import { } from '@types/googlemaps';
import { MapsAPILoader } from "angular2-google-maps/core";
declare let google:any;
@Component({
    selector: 'gmap-geocode-marker',
    templateUrl: './gmap-geocode-marker.html',
})
export class GeocodeMarkerComponent implements OnInit {


    @Input('markers') public inputMarker:any;
    @Input('lat') public lat:any;
    @Input('lng') public lng:any;
    @Input('currentRadius') public currentRadius:any;
    @Output('radiusChange') public radiusChange = new EventEmitter<any>();
    @Output('dragEnd') public dragEnd = new EventEmitter<any>();
    public markers:any = [];

    public constructor(private mapsAPILoader:MapsAPILoader, private ngZone:NgZone) {

    }

    public ngOnInit() {
        this.mapsAPILoader.load().then((map)=> {
            let mapCenter = new google.maps.Marker({
                position: new google.maps.LatLng(this.lat, this.lng),
                draggable: true
            });
            let searchCenter = mapCenter.getPosition();
            for (var i = 0; i < this.inputMarker.length; i++) {
                let myMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(this.inputMarker[i].lat, this.inputMarker[i].lng),
                    draggable: true
                });
                let geometry = google.maps.geometry.spherical.computeDistanceBetween(myMarker.getPosition(), searchCenter);
                console.log(geometry);
                if (parseInt(geometry) < this.currentRadius) {
                    this.markers.push(this.inputMarker[i]);
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
        if (this.currentRadius < parseInt(radius)) {
            for (var i = 0; i < this.inputMarker.length; i++) {
                let myMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(this.inputMarker[i].lat, this.inputMarker[i].lng),
                    draggable: true
                });
                let geometry = google.maps.geometry.spherical.computeDistanceBetween(myMarker.getPosition(), searchCenter);
                if (parseInt(geometry) < parseInt(radius)) {
                    this.markers.push(this.inputMarker[i]);
                }
            }
        }
        this.currentRadius = parseInt(radius);
        this.radiusChange.emit(this.currentRadius);
    }

    public clickedMarker() {

    }

    public markerDragEnd($event:MouseEvent) {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;

        let mapCenter = new google.maps.Marker({
            position: new google.maps.LatLng(this.lat, this.lng),
            draggable: true
        });
        let searchCenter = mapCenter.getPosition();
        for (var i = 0; i < this.inputMarker.length; i++) {
            let myMarker = new google.maps.Marker({
                position: new google.maps.LatLng(this.inputMarker[i].lat, this.inputMarker[i].lng),
                draggable: true
            });
            let geometry = google.maps.geometry.spherical.computeDistanceBetween(myMarker.getPosition(), searchCenter);
            console.log(geometry);
            if (parseInt(geometry) < this.currentRadius) {
                this.markers.push(this.inputMarker[i]);
                console.log(this.markers);
            } else {
                this.markers = [];
            }
        }

    }
}