import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-follow-item',
  templateUrl: './follow-item.component.html',
  styleUrls: ['./follow-item.component.css'],
  animations: [
    trigger("show", [
      state("1", style({opacity: 1, display: 'inline-block' })),
      state("2", style({opacity: 0, display: 'none' })),
      // transition("1 <=> 2", animate( "300ms" )),
    ])
  ],
})
export class FollowItemComponent implements OnInit {

  @Input('item') public item: any;
  public stateFollow = '1';
  public stateUnfollow = '2';
  public text: string  = 'Unfollow';
  constructor(private el: ElementRef) { }

  doUnfollow(item: any):void{
    this.stateUnfollow = this.stateUnfollow === '1' ? "2": "1";
    this.stateFollow = this.stateFollow === '1' ? "2": "1";
    console.log("doUnfollow: ");
  }

  doFollow(item: any):void{
    this.stateFollow = this.stateFollow === '1' ? "2": "1";
    this.stateUnfollow = this.stateUnfollow === '1' ? "2": "1";
    console.log("doFollow: ");
  }

  ngOnInit() {
    this.item.selected = 0;
  }

}
