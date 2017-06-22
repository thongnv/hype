import { Component, EventEmitter,OnInit,Input, Output,NgZone} from '@angular/core';
import { } from '@types/googlemaps';
import { MapsAPILoader } from "angular2-google-maps/core";
declare let google:any;
@Component({
    selector: 'gmap-geocode-marker',
    templateUrl: './gmap-geocode-marker.html',
})
export class GeocodeMarkerComponent implements OnInit {


    //@Input('events') public inputEvents:any;
    @Input('markers') public markers:any;
    @Input('lat') public lat:any;
    @Input('lng') public lng:any;
    @Input('currentRadius') public currentRadius:any;
    @Output('radiusChange') public radiusChange = new EventEmitter<any>();
    @Output('dragEnd') public dragEnd = new EventEmitter<any>();
    @Output('markerClick') public markerClick = new EventEmitter<any>();
    @Input('showCircle') public showCircle:any;
    
    public events:any[];
    public MARKER_ICON = '/assets/icon/icon_pointer.png';

    public constructor(private mapsAPILoader:MapsAPILoader, private ngZone:NgZone) {


    }

    public ngOnInit() {
        //this.loadMapRadius();
    }

    public markerRadiusChange(radius) {
        this.currentRadius = parseInt(radius);
        this.radiusChange.emit(this.currentRadius);
    }

    public clickedMarker(index) {
        this.markerClick.emit(index);
    }

    public mapClicked(e) {
        console.log(e);
    }

    public markerDragEnd($event) {
        if ($event.coords) {
            this.lat = $event.coords.lat;
            this.lng = $event.coords.lng;
            this.dragEnd.emit($event);
        }
    }

    public infoWindowClose($event) {
        console.log($event);
    }

}
