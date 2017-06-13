import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})

export class FavoriteComponent implements OnInit {

  public userInfo: any;
  public favorite: any;
  public selectedFavoriteType: any;
  public canDelete: boolean = false;
  public setList: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };
  public setPlace: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };
  public setEvent: any = {
    offset: 0, endOfList: false, loadingInProgress: false
  };

  private listPageNum: number = 0;
  private eventPageNum: number = 0;
  private placePageNum: number = 0;

  public constructor(private appState: AppState,
                     private mainService: MainService,
                     private route: ActivatedRoute) {
    this.selectedFavoriteType = 'event';

    this.userInfo = this.appState.state.userInfo;
    this.userInfo.places = [];
    this.userInfo.lists = [];
    this.userInfo.events = [];
  }

  public onSelectFavoriteType(type: string): void {
    this.selectedFavoriteType = type;
    switch (this.selectedFavoriteType) {
      case 'event':
        if (!this.setEvent.offset) {
          this.getEvent(null, this.eventPageNum);
        }
        break;
      case 'list':
        if (!this.setList.offset) {
          this.getList(null, this.listPageNum);
        }
        break;
      case 'place':
        if (!this.setPlace.offset) {
          this.getPlace(null, this.placePageNum);
        }
        break;
      default:
        break;
    }
    console.log('selectedFavoriteType: ', this.selectedFavoriteType);
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

  public onClickVote(item: number): void {
    console.log('onVoteEvent: ', item);
  }

  public ngOnInit() {
    this.canDelete = true;
    this.getUserProfile();
    this.getEvent(null, this.eventPageNum);
  }

  private getUserProfile(slugName?: string): void {

    this.mainService.getUserProfile(slugName).then((response) => {
      // this.mainService.getUserPublicProfile().then((response) => {
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
      console.log('====> userProfile response: ', response);
    });
  }

  private getPlace(slugName?: string, page?: number) {
    this.mainService.getUserPlace(slugName, page).then((response) => {
      console.log('====> getPlace response: ', response);
      if (response.total > 0) {
        response.results.forEach((item) => {
          this.userInfo.places.push(item);
          this.setPlace.offset++;
        });
        this.placePageNum = this.setPlace.offset / PAGE_SIZE;
      }
    });
  }

  private getList(slugName?: string, page?: number) {
    this.mainService.getUserList(slugName, page).then((response) => {
      console.log('====> getList response: ', response);
      if (response.total > 0) {
        response.data.forEach((item) => {
          this.userInfo.lists.push(item);
          this.setList.offset++;
        });
        this.listPageNum = this.setList.offset / PAGE_SIZE;
      }
    });
  }

  private getEvent(slugName?: string, page?: number) {
    this.mainService.getUserEvent(slugName, page).then((response) => {
      console.log('====> getEvent response: ', response);
      if (response.total > 0) {
        response.forEach((item) => {
          this.userInfo.events.push(item);
          this.setEvent.offset++;
        });
        this.eventPageNum = this.setEvent.offset / PAGE_SIZE;
      }
    });
  }
}
