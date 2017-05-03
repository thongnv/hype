import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {

  private data: any;
  constructor() { }

  ngOnInit() {
    this.data={lat: 1.690570, lng: 103.851923};
  }

}
