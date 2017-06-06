import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-member-navigation',
  templateUrl: './member-navigation.component.html',
  styleUrls: ['./member-navigation.component.css']
})
export class MemberNavigationComponent implements OnInit {

  @Input('data') public data: any;
  public show: boolean;

  public constructor() {
    this.show = false;
  }

  public ngOnInit() {
    this.show = this.data ? true : false;
  }

}
