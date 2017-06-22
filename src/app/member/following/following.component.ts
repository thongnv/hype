import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  public userInfo: any;
  public msgContent: string;
  public alertType: string;
  public followingPage: number = 0;
  public userFollow: boolean = false;
  public isCurrentUser: boolean = false;
  public set: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };
  public slugName: any;
  public sub: any;

  constructor(private appState: AppState,
              private loaderService: LoaderService,
              private mainService: MainService,
              private route: ActivatedRoute,
              private localStorageService: LocalStorageService) {
    this.loaderService.show();
    let followingPage = this.appState.state.followingPaging;
    if (followingPage !== undefined) {
      this.followingPage = followingPage;
    }
    this.appState.set('followingPage', this.followingPage);
    console.log('followingPage', this.followingPage);
  }

  public ngOnInit() {
    let userSlug = this.localStorageService.get('slug');
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      this.isCurrentUser = this.slugName === userSlug;
      console.log('USER: ', this.slugName);
      this.getUserProfile(this.slugName);
      this.getUserFollow('following', this.slugName, this.followingPage);
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
      this.mainService.getUserFollow('following', this.slugName, ++this.followingPage)
        .then((response) => {
          response.forEach((item) => {
            count++;
            this.userInfo.userFollowing.push(item);
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
    console.log('item', item);
    if (item.stateFollow === 'yes') {
      if (this.isCurrentUser) {
        this.userInfo.followingNumber--;
      }
    } else {
      if (this.isCurrentUser) {
        this.userInfo.followingNumber++;
      }
    }
    this.alertType = 'success';
    this.msgContent = 'Update following successful';
  }

  private getUserFollow(followFlag: string, slugName: string, page: number): void {
    this.mainService.getUserFollow(followFlag, slugName, page).then((response) => {
      this.userInfo.userFollowing = response;
      console.log('response', response);
      console.log('this.userInfo.userFollowing', this.userInfo.userFollowing);
      this.appState.set('userInfo', this.userInfo);
    });
  }

  private getUserProfile(slugName: string): void {
    this.userInfo = this.appState.state.userInfo;
    this.mainService.getUserProfile(slugName).then((response) => {
      this.userInfo.userName = response.field_first_name + ' ' + response.field_last_name;
      this.userInfo.firstName = response.field_first_name;
      this.userInfo.lastName = response.field_last_name;
      this.userInfo.userAvatar = response.field_image;
      this.userInfo.email = response.email;
      this.userInfo.country = response.field_country;
      this.userInfo.followingNumber = response.follow.following;
      this.userInfo.followerNumber = response.follow.follower;
      this.userInfo.contactNumber = response.field_contact_number;
      this.userInfo.receiveEmail = response.field_notify_email;
      this.userInfo.showNav = false;
      this.userInfo.uid = response.uid;
      this.userFollow = response.user_follow;
      this.appState.set('userInfo', this.userInfo);
      console.log('response: ', response);
      this.loaderService.hide();
    });
  }
}
