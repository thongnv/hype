import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  @Input('params') public params: any;

  public lat: number;
  public lng: number;

  public ngOnInit() {
    this.getLatLng();
  }

  private getLatLng(): void {
    this.lat = this.params.lat;
    this.lng = this.params.lng;
  }

}
