import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  @Input('params') public params: any;

  constructor() { }

  public lat: number;
  public lng: number;


  private getLatLng(): void{
    this.lat = this.params.lat;
    this.lng = this.params.lng;
  }

  public ngOnInit() {
    this.getLatLng();
  }

}
