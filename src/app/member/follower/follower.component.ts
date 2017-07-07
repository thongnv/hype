import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../helper/loader/loader.service';
import { User } from '../../app.interface';
import { AppSetting } from '../../app.setting';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';

@Component({
  selector: 'app-follower',
  templateUrl: './follower.component.html',
  styleUrls: ['./follower.component.css']
})

export class FollowerComponent implements OnInit {

  public currentUser: User;
  public user = AppSetting.defaultUser;
  public followerPage: number = 0;
  public msgContent: string;
  public alertType: string;
  public followed: boolean = false;
  public isCurrentUser: boolean = false;
  public set: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };
  public slugName: any;
  public sub: any;
  public ready = false;

  public constructor(private appState: AppState,
                     private loaderService: LoaderService,
                     private userService: UserService,
                     private followService: FollowService,
                     private route: ActivatedRoute,
                     private localStorageService: LocalStorageService) {
  }

  public ngOnInit() {
    this.loaderService.show();
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.appState.set('followerPage', this.followerPage);
    let followerPage = this.appState.state.followerPaging;
    if (followerPage !== undefined) {
      this.followerPage = followerPage;
    }
    this.sub = this.route.params.subscribe(
      (params) => {
        this.slugName = params['slug'];
        this.isCurrentUser = this.slugName === this.user.slug;
        this.userService.getProfile(this.slugName).subscribe(
          (resp) => {
            this.currentUser = resp.user;
            this.followed = resp.followed;
            this.currentUser.showNav = this.isCurrentUser;
            this.ready = true;
            this.userService.getFollowers(this.slugName, this.followerPage).subscribe(
              (response) => {
                this.currentUser.userFollower = response.result;
                this.currentUser.showNav = this.isCurrentUser;
              }
            );
          },
        (error) => {
            console.log(error);
          },
          () => {
            this.loaderService.hide();
          }
        );
      }
    );
    this.followService.getEmittedValue().subscribe(
      (data) => {
        if (this.currentUser.id === data.user.id) {
          this.followed = data.followed;
        }
        if (this.followed) {
          this.currentUser.userFollower.push(this.user);
        } else {
          // remove this.user from follower list
          this.currentUser.userFollower.splice(
            this.currentUser.userFollower.findIndex(
              (u) => u.id === this.user.id
            ), 1
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
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
      this.userService.getFollowers(this.slugName, ++this.followerPage).subscribe(
        (resp) => {
          let data = resp.result;
          data.forEach((item) => {
            count++;
            this.currentUser.userFollower.push(item);
          });
          if (count === 0) {
            this.set.endOfList = true;
            this.followerPage--;
          } else {
            this.set.offset += count;
          }
          this.set.loadingInProgress = false;
        });
    }
  }

  public updateFollow(item: any) {
    if (this.isCurrentUser) {
      if (item.followed) {
        this.currentUser.followingNumber++;
        if (item.id === this.user.id) {
          this.currentUser.followerNumber++;
          this.followed = true;
        }
      } else {
        this.currentUser.followingNumber--;
        if (item.id === this.user.id) {
          this.currentUser.followerNumber--;
          this.followed = false;
        }
      }
    } else {
      if (item.id === this.currentUser.id) {
        if (item.followed) {
          this.currentUser.followerNumber++;
        } else {
          this.currentUser.followerNumber--;
        }
      }
    }
  }
}
