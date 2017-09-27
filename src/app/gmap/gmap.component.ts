import { Component, Input, OnInit } from '@angular/core';
import { GmapService } from '../services/gmap.service';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  @Input('params') public params: any;
  @Input('styles') public styles: any;
  @Input('markers') public markers: any;

  public lat: number;
  public lng: number;

  public constructor(private gmapService: GmapService) {
  }

  public ngOnInit() {
    this.lat = this.params.lat;
    this.lng = this.params.lng;
    this.markers = this.gmapService.getMarkers();
  }

  public handleRadiusChange() {
    this.updateGoogleMarkers();
  }

  public handleDrag() {
    this.updateGoogleMarkers();
  }

  private updateGoogleMarkers() {
    this.markers = this.gmapService.updateMarkers();
  }

}
