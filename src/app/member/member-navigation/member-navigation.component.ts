import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../app.interface';
import { FollowService } from '../../services/follow.service';

@Component({
  selector: 'app-member-navigation',
  templateUrl: './member-navigation.component.html',
  styleUrls: ['./member-navigation.component.css']
})
export class MemberNavigationComponent implements OnInit {

  @Input() public user: User;
  @Input() public currentUser: User;

  private isCurrentUser: boolean = false;

  public constructor(
    private userService: UserService,
    private followService: FollowService) {
  }

  public ngOnInit() {
    this.isCurrentUser = this.user.slug === this.currentUser.slug;
  }

  public onFollow() {
    this.userService.toggleFollow(this.currentUser.id).subscribe(
      (resp) => {
        console.log(resp);
        this.currentUser.followed = !this.currentUser.followed;
        this.currentUser.followerNumber++;
        if (this.isCurrentUser) {
          this.currentUser.followingNumber++;
        }
        this.followService.change(this.currentUser, this.currentUser.followed);
    });
  }

  public onUnFollow() {
    this.userService.toggleFollow(this.currentUser.id).subscribe(
      (resp) => {
        console.log(resp);
        this.currentUser.followed = !this.currentUser.followed;
        this.currentUser.followerNumber--;
        if (this.isCurrentUser) {
          this.currentUser.followingNumber--;
        }
        this.followService.change(this.currentUser, this.currentUser.followed);
    });
  }

}
