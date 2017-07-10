import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';

@Component({
  selector: 'app-follow-item',
  templateUrl: './follow-item.component.html',
  styleUrls: ['./follow-item.component.css'],
})
export class FollowItemComponent implements OnInit {

  @Input() public item: any;

  @Output() public onUpdate = new EventEmitter<any>();

  constructor(
    private userService: UserService,
    private followService: FollowService) {
  }

  public ngOnInit() {
    this.followService.getEmittedValue().subscribe(
      (data) => {
        if (this.item.id === data.user.id) {
          this.item.followed = data.followed;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public toggleFollow(): void {
    this.userService.toggleFollow(this.item.id).subscribe(
      (resp) => {
        if (resp.status) {
          this.item.followed = !this.item.followed;
          this.onUpdate.emit(this.item);
          this.followService.change(this.item, this.item.followed);
        }
    });
  }
}
