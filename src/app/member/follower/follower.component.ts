import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../helper/loader/loader.service';
import { Follower, User } from '../../app.interface';
import { AppSetting } from '../../app.setting';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';

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
  public isCurrentUser: boolean = false;
  public set: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };
  public slugName: any;
  public ready = false;

  public constructor(private appState: AppState,
                     private loaderService: LoaderService,
                     private smallLoader: SmallLoaderService,
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
      this.userService.getProfile().subscribe(
        (resp) => this.user = resp
      );
    }
    this.appState.set('followerPage', this.followerPage);
    let followerPage = this.appState.state.followerPaging;
    if (followerPage !== undefined) {
      this.followerPage = followerPage;
    }
    this.route.params.subscribe(
      (params) => {
        this.slugName = params['slug'];
        this.isCurrentUser = this.slugName === this.user.slug;
        this.userService.getProfile(this.slugName).subscribe(
          (resp) => {
            this.currentUser = resp;
            this.currentUser.showNav = this.isCurrentUser;
            this.ready = true;
            this.smallLoader.show();
            this.userService.getFollowers(this.slugName, this.followerPage).subscribe(
              (response) => {
                this.currentUser.followers =  extractFollowers(response.result);
                this.currentUser.showNav = this.isCurrentUser;
                this.smallLoader.hide();
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
          this.currentUser.followed = data.followed;
          if (this.currentUser.followed) {
            this.currentUser.followers.push(
              {
                id: this.user.id,
                followed: true,
                avatar: this.user.avatar,
                name: this.user.name,
                slug: this.user.slug
              }
            );
          } else {
            // remove this.user from this.currentUser.followers
            this.currentUser.followers.splice(
              this.currentUser.followers.findIndex(
                (u) => u.id === this.user.id
              ), 1
            );
          }
        } else {
          if (this.user.id === data.user.id) {
            this.user.followed = data.followed;
          }
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
            this.currentUser.followers.push(item);
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
      } else {
        this.currentUser.followingNumber--;
      }
    }
    if (item.id === this.currentUser.id) {
      if (item.followed) {
        this.currentUser.followerNumber++;
      } else {
        this.currentUser.followerNumber--;
      }
    }
  }
}

function extractFollowers(data): Follower[] {
  let followers = [];
  for (let item of data) {
    let followerName = '';
    if (item.field_first_name) {
      followerName += item.field_first_name;
    }
    if (item.field_last_name) {
      followerName += ' ' + item.field_last_name;
    }
    if (!followerName) {
      followerName = item.name;
    }
    followers.push({
      id: item.id,
      followed: item.flag === 1,
      avatar: item.avatar,
      name: followerName,
      slug: item.slug
    });
  }
  return followers;
}
