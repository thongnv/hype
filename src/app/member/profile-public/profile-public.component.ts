import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';

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
  private sub: any;
  private slugName: any;

  public constructor(
    private appState: AppState,
    private mainService: MainService,
    private route: ActivatedRoute) {
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
    console.log('xOK');
    this.demo();
    // this.mainService.getUserPublicProfile().then((resp) => {
    //   this.publicProfile = resp.public_profile;
    //   this.favorite = resp.favorite;
    //   this.userInfo.showNav = false;
    // });
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      console.log('USER: ', this.slugName);
      this.getUserProfile(this.slugName);
    });
  }

  private getUserProfile(slugName?: string): void {

    this.mainService.getUserProfile(slugName).then((response) => {
      // this.mainService.getUserPublicProfile().then((response) => {
      this.userInfo.userName = response.field_first_name +
        ' ' + response.field_last_name;
      this.userInfo.firstName = response.field_first_name;
      this.userInfo.lastName = response.field_last_name;
      this.userInfo.userAvatar = response.field_image;
      this.userInfo.email = response.email;
      this.userInfo.country = response.field_country;
      this.userInfo.followingNumber = response.follow.following;
      this.userInfo.followerNumber = response.follow.follower;
      this.userInfo.contactNumber = response.field_contact_number;
      this.userInfo.receiveEmail = response.field_notify_email;
      console.log('====> userProfile response: ', response);
    });
  }
}
