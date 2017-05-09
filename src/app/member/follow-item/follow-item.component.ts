import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-follow-item',
  templateUrl: './follow-item.component.html',
  styleUrls: ['./follow-item.component.css'],
  animations: [
    trigger("show", [
      state("open", style({opacity: 1})),
      state("closed", style({opacity: 0})),
      transition("open <=> closed", animate( "3000ms" )),
    ])
  ],
})
export class FollowItemComponent implements OnInit {

  @Input('item') public item: any;
  public state = 'open';
  public timeOutRef;
  constructor() { }

  doUnfollow(item: any):void{
    console.log("doUnfollow: ", item.name);
    this.state = 'closed';
  }
  ngOnInit() {
    this.item.selected = 0;
  }

}
