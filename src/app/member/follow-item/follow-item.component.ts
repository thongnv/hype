import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-follow-item',
  templateUrl: './follow-item.component.html',
  styleUrls: ['./follow-item.component.css']
})
export class FollowItemComponent implements OnInit {

  @Input('item') public item: any;
  constructor() { }

  doUnfollow(item: any):void{
    item.selected = (item.selected)? 0 : 1;
  }
  ngOnInit() {
    this.item.selected = 0;
  }

}
