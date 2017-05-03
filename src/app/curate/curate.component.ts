import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-curate',
  templateUrl: './curate.component.html',
  styleUrls: ['./curate.component.css']
})
export class CurateComponent implements OnInit {

  private data: any;
  constructor() { }

  ngOnInit() {
    this.data={lat: 1.390570, lng: 103.351923};
  }

}
