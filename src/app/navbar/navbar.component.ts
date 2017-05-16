import { Component, OnInit } from '@angular/core';
import { AppState } from '../app.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isIn = false;
  public userInfo: any;
  public mapOptions: any[];
  public selectedMapOption: any;

  public constructor(private appState: AppState) { }

  public demo(): void {
    this.userInfo = this.appState.state.userInfo;
  }

  public onSelectMapOption(option: any): void {
    this.selectedMapOption = option;
  }

  public toggleState() {
    let bool = this.isIn;
    this.isIn = bool === false;
  }

  public ngOnInit() {
    this.demo();
    this.mapOptions = [
      {id: 1, name: 'Singapore'},
      {id: 2, name: 'Neighbourhood'},
      {id: 3, name: 'option 2'},
      {id: 4, name: 'option 3'}
    ];
    this.selectedMapOption = this.mapOptions[0];
    console.log(this.appState);
  }

}
