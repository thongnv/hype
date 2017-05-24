import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})

export class FavoriteComponent implements OnInit {

  public data: any;
  public userInfo: any;
  public selectedFavoriteType: any;
  public favorite: any;

  constructor(private appState: AppState, private mainService: MainService) {
    this.userInfo = this.appState.state.userInfo;
    this.selectedFavoriteType = 'event';
  }
  public onSelectFavoriteType(type: string): void {
    this.selectedFavoriteType = type;
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
    // this.getUserProfile();
    // this.getUserFavorite('activity');
    this.mainService.getUserPublicProfile().then((resp) => {
      console.log('getUserPublicProfile', resp);
      this.userInfo = resp.public_profile;
      this.favorite = resp.favorite;
    });
  }

  private getUserFavorite(type: string) {
    this.mainService.getUserFavorite(type).then((resp) => {
      this.userInfo.favorite = resp;
      this.appState.set('userInfo', this.userInfo);
    });
  }

  private getUserProfile(): void {
    this.mainService.getUserProfile().then((response) => {

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

      this.appState.set('userInfo', this.userInfo);
      console.log('response: ', response);
    });
  }
}
