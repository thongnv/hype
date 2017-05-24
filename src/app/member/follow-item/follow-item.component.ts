import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { trigger, state, style } from '@angular/animations';
import { MainService } from '../../services/main.service';
@Component({
  selector: 'app-follow-item',
  templateUrl: './follow-item.component.html',
  styleUrls: ['./follow-item.component.css'],
  animations: [
    trigger('follow', [
      state('yes', style({opacity: 1, display: 'inline-block'})),
      state('no', style({opacity: 0, display: 'none'})),
      // transition('1 <=> 2', animate( '300ms' )),
    ]),
    trigger('unfollow', [
      state('yes', style({opacity: 0, display: 'none'})),
      state('no', style({opacity: 1, display: 'inline-block'})),
      // transition('1 <=> 2', animate( '300ms' )),
    ])
  ],
})
export class FollowItemComponent implements OnInit {

  @Input('item') public item: any;
  @Input('flag') public flag: any;
  public stateFollow: string;

  constructor(private mainService: MainService) {
  }

  public updateFollow(item: any): void {
    this.mainService.updateUserFollow(item.id).then((resp) => {
      console.log('resp: ', resp);
      if (resp.status) {
        this.stateFollow = this.stateFollow === 'yes' ? 'no' : 'yes';
      }
    });
  }

  public ngOnInit() {
    if (this.flag === 'following') {
      this.stateFollow = 'no';
    } else {
      this.stateFollow = (this.item.flag) ? 'no' : 'yes';
    }
  }

}