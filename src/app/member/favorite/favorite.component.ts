import { Component, OnInit } from '@angular/core';
import {AppState} from "../../app.service";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})

export class FavoriteComponent implements OnInit {

  public data: any;
  public userInfo: any;
  constructor(
      private appState: AppState
  ) { }

  demo(): void{
    this.userInfo = this.appState.state.userInfo;
  }

  ngOnInit() {
    this.demo();
  }

}
