import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../helper/loader/loader.service';
import { User } from '../../app.interface';
import { AppSetting } from '../../app.setting';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  public user = AppSetting.defaultUser;
  public currentUser: User;
  public msgContent: string;
  public alertType: string;
  public followingPage: number = 0;
  public followed: boolean = false;
  public isCurrentUser: boolean = false;
  public set: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };
  public slugName: any;
  public sub: any;
  public ready = false;

  constructor(private appState: AppState,
              private loaderService: LoaderService,
              private userService: UserService,
              private route: ActivatedRoute,
              private localStorageService: LocalStorageService) {
  }

  public ngOnInit() {
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.loaderService.show();
    let followingPage = this.appState.state.followingPaging;
    if (followingPage !== undefined) {
      this.followingPage = followingPage;
    }
    this.appState.set('followingPage', this.followingPage);
    this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      this.isCurrentUser = this.slugName === this.user.slug;
      this.userService.getProfile(this.slugName).subscribe(
        (resp) => {
          this.currentUser = resp.user;
          this.followed  = resp.followed;
          this.currentUser.showNav = this.isCurrentUser;
          this.ready = true;
          this.userService.getFollowings(this.slugName, this.followingPage).subscribe(
            (res) => {
              this.currentUser.userFollowing = res.result;
            },
            (error) => console.log(error)
          );
        },
        (error) => console.log(error),
        () => this.loaderService.hide()
      );
    });
  }

  public onFollowScrollDown(data) {
    let elm = data.srcElement;
    if (elm.clientHeight + elm.scrollTop === elm.scrollHeight) {
      this.loadMore();
    }
  }

  public loadMore(): void {
    if (!this.set.loadingInProgress) {
      this.set.loadingInProgress = true;
      let count = 0;
      this.userService.getFollowings(this.slugName, ++this.followingPage).subscribe(
        (resp) => {
          let data = resp.result;
          data.forEach((item) => {
            count++;
            this.currentUser.userFollowing.push(item);
          });
          if (count === 0) {
            this.set.endOfList = true;
            this.followingPage--;
          } else {
            this.set.offset += count;
          }
          this.set.loadingInProgress = false;
        });
    }
  }

  public updateFollow(item: any) {
    let targetUser = this.user;
    if (this.isCurrentUser) {
      targetUser = this.currentUser;
    }
    if (item.followed) {
      targetUser.followingNumber++;
      targetUser.followerNumber++;
    } else {
      targetUser.followingNumber--;
      targetUser.followerNumber--;
    }
    this.alertType = 'success';
    this.msgContent = 'Update successfully';
  }
}
