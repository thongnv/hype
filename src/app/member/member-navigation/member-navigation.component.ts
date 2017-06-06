import { Component, OnInit, Input } from '@angular/core';
import { AppState } from '../../app.service';

@Component({
  selector: 'app-member-navigation',
  templateUrl: './member-navigation.component.html',
  styleUrls: ['./member-navigation.component.css']
})
export class MemberNavigationComponent implements OnInit {

  @Input('data') public data: any;
  public show: boolean;

  public constructor(public appState: AppState) {
    this.show = false;
  }

  public ngOnInit() {
    this.show = this.data ? true : false;
  }

}
