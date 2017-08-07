import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { User } from '../../app.interface';

@Component({
  selector: 'app-follow-item',
  templateUrl: './follow-item.component.html',
  styleUrls: ['./follow-item.component.css'],
})
export class FollowItemComponent implements OnInit {

  @Input() public item: any;
  @Input() public user: User;

  @Output() public onUpdate = new EventEmitter<any>();

  public isCurrentUser: boolean;

  constructor(
    private userService: UserService,
    private followService: FollowService) {
  }

  public ngOnInit() {
    this.isCurrentUser = this.user.id === this.item.id;
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
