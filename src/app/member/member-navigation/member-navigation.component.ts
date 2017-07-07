import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../app.interface';

@Component({
  selector: 'app-member-navigation',
  templateUrl: './member-navigation.component.html',
  styleUrls: ['./member-navigation.component.css']
})
export class MemberNavigationComponent implements OnInit {

  @Input() public user: User;
  @Input() public currentUser: User;
  @Input() public followed: boolean;
  @Input() public showFollowBtn: boolean;

  @Output() public onUpdate = new EventEmitter<any>();

  private isCurrentUser: boolean = false;

  public constructor(private userService: UserService) {
  }

  public ngOnInit() {
    this.isCurrentUser = this.user.slug === this.currentUser.slug;
  }

  public onFollow() {
    this.userService.toggleFollow(this.currentUser.id).subscribe(
      (resp) => {
        console.log(resp);
        this.followed = !this.followed;
        this.currentUser.followerNumber++;
        if (this.isCurrentUser) {
          this.currentUser.followingNumber++;
        }
        // TODO: update followings + followers on right area
    });
  }

  public onUnFollow() {
    this.userService.toggleFollow(this.currentUser.id).subscribe(
      (resp) => {
        console.log(resp);
        this.followed = !this.followed;
        this.currentUser.followerNumber--;
        if (this.isCurrentUser) {
          this.currentUser.followingNumber--;
        }
        // TODO: update followings + followers on right area
    });
  }

}
