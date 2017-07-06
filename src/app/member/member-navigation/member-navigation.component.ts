import { Component, OnInit, Input } from '@angular/core';
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
  private isCurrentUser: boolean = false;

  public constructor(private userService: UserService) {
  }

  public ngOnInit() {
    this.isCurrentUser = this.user.slug === this.currentUser.slug;
  }

  public onFollow() {
    this.userService.toggleFollow(this.currentUser.id).subscribe(
      (resp) => {
        this.followed = !this.followed;
        if (this.isCurrentUser) {
          this.user.followingNumber++;
          this.user.followerNumber++;
        } else {
          this.user.followerNumber++;
        }
    });
  }

  public onUnFollow() {
    this.userService.toggleFollow(this.currentUser.id).subscribe(
      (resp) => {
        this.followed = !this.followed;
        if (this.isCurrentUser) {
          this.user.followingNumber--;
          this.user.followerNumber--;
        } else {
          this.user.followerNumber--;
        }
    });
  }

}
