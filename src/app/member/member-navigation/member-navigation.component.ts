import { Component, OnInit, Input } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-member-navigation',
  templateUrl: './member-navigation.component.html',
  styleUrls: ['./member-navigation.component.css']
})
export class MemberNavigationComponent implements OnInit {

  @Input('data') public data: any;
  @Input('slugName') public slugName: any;
  @Input('userFollow') public userFollow: any;
  public show: boolean;

  public constructor(public appState: AppState, private mainService: MainService) {
    this.show = false;
  }

  public ngOnInit() {
    this.show = this.data ? true : false;
    console.log('this.data: ', this.data);
  }

  public onFollow() {
    this.mainService.updateUserFollow(this.data.uid).then((resp) => {
      console.log('follow: ', resp);
      this.userFollow = !this.userFollow;
      this.data.followingNumber++;
    });
  }

  public onUnFollow() {
    this.mainService.updateUserFollow(this.data.uid).then((resp) => {
      console.log('follow: ', resp);
      this.userFollow = !this.userFollow;
      this.data.followingNumber--;
    });
  }

}
