import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})
export class InterestComponent implements OnInit {

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
