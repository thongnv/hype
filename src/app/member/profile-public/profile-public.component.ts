import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { exit } from 'shelljs';
import { log } from 'util';

@Component({
  selector: 'app-profile-public',
  templateUrl: './profile-public.component.html',
  styleUrls: ['./profile-public.component.css']
})
export class ProfilePublicComponent implements OnInit {

  public userInfo: any;
  public publicProfile: any;
  public favorite: any;
  public selectedFavoriteType: any;

  public constructor(private appState: AppState, private mainService: MainService) {
    this.selectedFavoriteType = 'event';
  }

  public onSelectFavoriteType(type: string): void {
    this.selectedFavoriteType = type;
  }

  public demo(): void {
    this.userInfo = this.appState.state.userInfo;
  }

  public onClickLike(item: any): void {
    this.favorite.forEach((fav, index) => {
      if (fav.id === item.id) {
        this.favorite[index] = item;
      }
    });
    console.log('onClickLike: ', item);
  }

  public onClickDelete(item: any) {
    let selectedId = null;
    this.favorite.forEach((fav, index) => {
      if (fav && fav.id === item.id) {
        selectedId = index;
        return true;
      }
    });
    if (selectedId != null) {
      delete this.favorite[selectedId];
      this.favorite = this.favorite.filter((fav) => fav.id !== selectedId);
      console.log('deleted ', selectedId);
    } else {
      console.log('CAN NOT delete');
    }
  }

  public ngOnInit() {
    this.demo();
    this.mainService.getUserPublicProfile().then((resp) => {
      this.publicProfile = resp.public_profile;
      this.favorite = resp.favorite;
      this.userInfo.showNav = false;
    });
  }
}
