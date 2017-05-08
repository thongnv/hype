import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})

export class InterestComponent implements OnInit {

  public userInfo: any;
  public intersets: any;
  constructor(
      private appState: AppState
  ) { }

  demo(): void{
    this.userInfo = this.appState.state.userInfo;
    this.intersets = [
      {id: 1, name:'interest 1'},
      {id: 2, name:'interest 2'},
      {id: 3, name:'interest 3'},
      {id: 4, name:'interest 4'},
      {id: 5, name:'interest 5'},
      {id: 6, name:'interest 6'},
      {id: 7, name:'interest 7'},
      {id: 8, name:'interest 8'},
      {id: 9, name:'interest 9'},
      {id: 10, name:'interest 10'},
      {id: 11, name:'interest 11'},
      {id: 12, name:'interest 12'},
      {id: 13, name:'interest 13'},
      {id: 14, name:'interest 14'},
      {id: 15, name:'interest 15'},
    ];
  }
  ngOnInit() {
    this.demo();
  }

}
