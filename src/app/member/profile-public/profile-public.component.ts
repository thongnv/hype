import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-profile-public',
  templateUrl: './profile-public.component.html',
  styleUrls: ['./profile-public.component.css']
})
export class ProfilePublicComponent implements OnInit {

  public userInfo: any;
  public favorite: any;
  public selectedFavoriteType: any;
  public canDelete: boolean = false;
  private sub: any;
  private slugName: any;
  private listPageNum: number = 0;
  private eventPageNum: number = 0;
  private placePageNum: number = 0;

  public constructor(private appState: AppState,
                     private mainService: MainService,
                     private route: ActivatedRoute,
                     private localStorageService: LocalStorageService
  ) {
    this.selectedFavoriteType = 'event';
  }

  public onSelectFavoriteType(type: string): void {
    this.selectedFavoriteType = type;
    console.log('selectedFavoriteType: ', this.selectedFavoriteType);
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

  public onClickDeleteEvent(item: any) {
    console.log('onClickDeleteEvent', item);
  }
  public onClickDeleteList(item: any) {
    console.log('onClickDeleteList', item);
  }
  public onClickDeletePlace(item: any) {
    console.log('onClickDeletePlace', item);
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

  public onClickVote(item: number): void {
    console.log('onVoteEvent: ', item);
  }

  public ngOnInit() {
    this.demo();
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      this.canDelete = this.localStorageService.get('slug') === this.slugName;
      console.log('USER: ', this.slugName);
      this.getUserProfile(this.slugName);
      this.getEvent(this.slugName, this.eventPageNum);
      this.getPlace(this.slugName, this.placePageNum);
      this.getList(this.slugName, this.listPageNum);
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

  private getPlace(slugName?: string, page?: number) {
    this.mainService.getUserPlace(slugName, page).then((response) => {
      // this.mainService.getUserPublicProfile().then((response) => {
      this.userInfo.places = response.data;
      console.log('====> getPlace response: ', response);
    });
  }

  private getList(slugName?: string, page?: number) {
    this.mainService.getUserList(slugName, page).then((response) => {
      // this.mainService.getUserPublicProfile().then((response) => {
      this.userInfo.lists = response.data;
      console.log('====> getList response: ', response);
    });
  }

  private getEvent(slugName?: string, page?: number) {
    this.mainService.getUserEvent(slugName, page).then((response) => {
      // this.mainService.getUserPublicProfile().then((response) => {
      this.userInfo.events = response;
      console.log('====> getEvent response: ', response);
    });
  }
}
