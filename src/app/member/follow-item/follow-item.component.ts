import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style } from '@angular/animations';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-follow-item',
  templateUrl: './follow-item.component.html',
  styleUrls: ['./follow-item.component.css'],
  animations: [
    trigger('follow', [
      state('yes', style({opacity: .5, display: 'inline-block'})),
      state('no', style({opacity: 0, display: 'none'})),
    ]),
    trigger('unfollow', [
      state('yes', style({opacity: 0, display: 'none'})),
      state('no', style({opacity: .5, display: 'inline-block'})),
    ])
  ],
})
export class FollowItemComponent implements OnInit {

  @Input('item') public item: any;
  @Input('flag') public flag: any;

  @Output('onUpdate') public onUpdate = new EventEmitter<any>();
  public stateFollow: string;

  constructor(private userService: UserService) {
  }

  public updateFollow(item: any): void {
    this.userService.updateUserFollow(item.id).subscribe(
      (resp) => {
        if (resp.status) {
          this.stateFollow = this.stateFollow === 'yes' ? 'no' : 'yes';
          item.stateFollow = this.stateFollow;
          this.onUpdate.emit(item);
        }
    });
  }

  public ngOnInit() {
    this.stateFollow = (this.item.flag) ? 'no' : 'yes';
  }

}
