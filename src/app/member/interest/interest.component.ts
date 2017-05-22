import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})

export class InterestComponent implements OnInit {

  public userInfo: any;
  public interests: any;

  constructor(private appState: AppState, private mainService: MainService) {
    this.userInfo = this.appState.state.userInfo;
  }

  public onSubmit() {
    console.log('sending update: ', this.interests);
    this.mainService.updateUserInterests(this.interests).then((resp) => {
      if (resp.status === null) {
        console.log('update fail: ');
        this.getInterests();
      }
    });
  }

  public getInterests(): void {
    this.mainService.getUserInterest().then((response) => {
      this.interests = response;
      console.log('response: ', response);
    });
  }

  public ngOnInit() {
    this.getInterests();
  }

}
