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

  @Input('data') public data: any;
  @Input('slugName') public slugName: any;
  @Input('userFollow') public userFollow: any;
  @Input('showFollow') public showFollow: boolean;
  @Input('currentComponent') public currentComponent: string = '';
  public show: boolean;
  private isCurrentUser: boolean = false;

  public constructor(public appState: AppState,
                     private mainService: MainService,
                     private localStorageService: LocalStorageService) {
    this.show = false;

  }

  public ngOnInit() {
    console.log('uer==========> ', this.data);
    this.isCurrentUser = this.localStorageService.get('slug') === this.slugName;
    console.log('slugName: ', this.slugName);
    console.log('slug: ', this.localStorageService.get('slug'));
    console.log('isCurrentUser: ', this.isCurrentUser);
    this.show = this.data ? true : false;
    console.log('this.data: ', this.data);
  }

  public onFollow() {
    this.mainService.updateUserFollow(this.data.uid).then((resp) => {
      console.log('follow: ', resp);
      this.userFollow = !this.userFollow;
      if (this.isCurrentUser) {
        this.data.followingNumber++;
        this.data.followerNumber++;
      } else {
        this.data.followerNumber++;
      }

    });
  }

  public onUnFollow() {
    this.mainService.updateUserFollow(this.data.uid).then((resp) => {
      console.log('follow: ', resp);
      this.userFollow = !this.userFollow;
      if (this.isCurrentUser) {
        this.data.followingNumber--;
        this.data.followerNumber--;
      } else {
        this.data.followerNumber--;
      }
    });
  }

}
