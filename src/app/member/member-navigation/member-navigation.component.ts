import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../app.interface';
import { FollowService } from '../../services/follow.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-member-navigation',
  templateUrl: './member-navigation.component.html',
  styleUrls: ['./member-navigation.component.css']
})
export class MemberNavigationComponent implements OnInit {

  @Input() public user: User;
  @Input() public currentUser: User;

  private isCurrentUser: boolean = false;

  public constructor(private titleService: Title,
                     private userService: UserService,
                     private followService: FollowService) {
  }

  public ngOnInit() {
    this.titleService.setTitle(this.currentUser.name);
    this.isCurrentUser = this.user.id === this.currentUser.id;
  }

  public toggleFollow() {
    this.userService.toggleFollow(this.currentUser.id).subscribe(
      (resp) => {
        this.currentUser.followed = !this.currentUser.followed;
        if (this.currentUser.followed) {
          this.currentUser.followerNumber++;
          if (this.isCurrentUser) {
            this.currentUser.followingNumber++;
          }
        } else {
          this.currentUser.followerNumber--;
          if (this.isCurrentUser) {
            this.currentUser.followingNumber--;
          }
        }
        this.followService.change(this.currentUser, this.currentUser.followed);
      });
  }

}
