import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})

export class FavoriteComponent implements OnInit {

  public data: any;

  public ngOnInit() {
    this.data = {lat: 1.290570, lng: 105.851923};
  }

}
