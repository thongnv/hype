import { Component, OnInit, Input } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { LocalStorageService } from 'angular-2-local-storage';

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

  public constructor(public appState: AppState,
                     private mainService: MainService) {
  }

  public ngOnInit() {
    this.isCurrentUser = this.user.slug === this.slugName;
    this.show = !!this.user;
  }

  public onFollow() {
    this.mainService.updateUserFollow(this.user.uid).then((resp) => {
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
    this.mainService.updateUserFollow(this.user.uid).then((resp) => {
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
