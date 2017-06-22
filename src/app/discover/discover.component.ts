import { Component, OnInit } from '@angular/core';
import { AppSetting } from '../app.setting';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})

export class DiscoverComponent implements OnInit {

  public data: any;
  public gMapStyles: any;

  public ngOnInit() {
    this.gMapStyles = AppSetting.GMAP_STYLE;
    this.data = {lat: 1.690570, lng: 103.851923};
  }

}
