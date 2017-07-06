import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-member-navigation',
  templateUrl: './member-navigation.component.html',
  styleUrls: ['./member-navigation.component.css']
})
export class MemberNavigationComponent implements OnInit {

  @Input() public user: any;
  @Input() public slugName: any;
  @Input() public userFollow: any;
  @Input() public showFollow: boolean;
  @Input() public currentComponent: string = '';
  public show: boolean = false;
  private isCurrentUser: boolean = false;

  public constructor(private userService: UserService) {
  }

  public ngOnInit() {
    this.isCurrentUser = this.user.slug === this.slugName;
    this.show = !!this.user;
  }

  public onFollow() {
    this.userService.updateUserFollow(this.user.uid).subscribe(
      (resp) => {
        this.userFollow = !this.userFollow;
        if (this.isCurrentUser) {
          this.user.followingNumber++;
          this.user.followerNumber++;
        } else {
          this.user.followerNumber++;
        }
    });
  }

  public onUnFollow() {
    this.userService.updateUserFollow(this.user.uid).subscribe(
      (resp) => {
        this.userFollow = !this.userFollow;
        if (this.isCurrentUser) {
          this.user.followingNumber--;
          this.user.followerNumber--;
        } else {
          this.user.followerNumber--;
        }
    });
  }

}
