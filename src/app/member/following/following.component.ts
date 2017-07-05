import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../helper/loader/loader.service';
import { User } from '../../app.interface';
import { AppSetting } from '../../app.setting';

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
  public userFollow: boolean = false;
  public isCurrentUser: boolean = false;
  public set: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };
  public slugName: any;
  public sub: any;
  public ready = false;

  constructor(private appState: AppState,
              private loaderService: LoaderService,
              private mainService: MainService,
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
      this.mainService.getUserProfile(this.slugName).subscribe(
        (resp: User) => {
          this.currentUser = resp;
          this.currentUser.showNav = this.isCurrentUser;
          this.ready = true;
          this.mainService.getFollowings(this.slugName, this.followingPage).subscribe(
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
      this.mainService.getFollowings(this.slugName, ++this.followingPage).subscribe(
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
    console.log('item', item);
    if (item.stateFollow === 'yes') {
      if (this.isCurrentUser) {
        this.currentUser.followingNumber--;
      }
    } else {
      if (this.isCurrentUser) {
        this.currentUser.followingNumber++;
      }
    }
    this.alertType = 'success';
    this.msgContent = 'Update following successful';
  }
}
