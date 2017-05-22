import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-profile-public',
  templateUrl: './profile-public.component.html',
  styleUrls: ['./profile-public.component.css']
})
export class ProfilePublicComponent implements OnInit {

  public userInfo: any;
  public publicProfile: any;

  public constructor(private appState: AppState, private mainService: MainService) {
  }

  public demo(): void {
    this.userInfo = this.appState.state.userInfo;
  }

  public ngOnInit() {
    this.demo();
    this.mainService.getUserPublicProfile().then((resp) => {
      console.log('getUserPublicProfile', resp);
      this.publicProfile = resp.favorite;
    });
  }
}
