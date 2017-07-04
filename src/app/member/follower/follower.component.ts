import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../shared/loader/loader.service';
import { User } from '../../app.interface';

@Component({
  selector: 'app-follower',
  templateUrl: './follower.component.html',
  styleUrls: ['./follower.component.css']
})

export class FollowerComponent implements OnInit {

  public user: User;
  public followingPage: number = 0;
  public msgContent: string;
  public alertType: string;
  public userFollow: boolean = false;
  public isCurrentUser: boolean = false;
  public set: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };
  public slugName: any;
  public sub: any;

  public constructor(private appState: AppState,
                     private loaderService: LoaderService,
                     private mainService: MainService,
                     private route: ActivatedRoute,
                     private localStorageService: LocalStorageService) {
    this.loaderService.show();
    this.user = this.localStorageService.get('user');

    let followingPage = this.appState.state.followingPaging;
    if (followingPage !== undefined) {
      this.followingPage = followingPage;
    }
    this.appState.set('followingPage', this.followingPage);
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
            this.user.userFollowing.push(item);
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

  public ngOnInit() {
    let userSlug = this.localStorageService.get('slug');
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      this.slugName = params['slug'];
      this.isCurrentUser = this.slugName === userSlug;
      console.log('USER: ', this.slugName);
      this.getUserProfile(this.slugName);
      this.getUserFollow('follower', this.slugName, this.followingPage);
    });
  }

  public updateFollow(item: any) {
    console.log('item', item);
    if (item.stateFollow === 'yes') {
      if (this.isCurrentUser) {
        this.user.followingNumber--;
      }
    } else {
      if (this.isCurrentUser) {
        this.user.followingNumber++;
      }
    }
    this.alertType = 'success';
    this.msgContent = 'Update following successful';
  }

  private getUserFollow(followFlag: string, slugName: string, page: number): void {
    this.mainService.getUserFollow(followFlag, slugName, page).then((response) => {
      this.user.userFollower = response;
      console.log('response', response);
      this.appState.set('user', this.user);
    });
  }

  private getUserProfile(slugName: string): void {
    this.user = this.localStorageService.get('user');
    this.mainService.getUserProfile(slugName).subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.loaderService.hide();
        this.ready = true;
      });
  }
}
