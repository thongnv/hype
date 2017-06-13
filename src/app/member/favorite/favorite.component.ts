import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

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

  private sub: any;
  private slugName: any;
  private listPageNum: number = 0;
  private eventPageNum: number = 0;
  private placePageNum: number = 0;

  public constructor(private appState: AppState,
                     private mainService: MainService,
                     private route: ActivatedRoute,
                     private localStorageService: LocalStorageService) {
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
          this.getEvent(this.slugName, this.eventPageNum);
        }
        break;
      case 'list':
        if (!this.setList.offset) {
          this.getList(this.slugName, this.listPageNum);
        }
        break;
      case 'place':
        if (!this.setPlace.offset) {
          this.getPlace(this.slugName, this.placePageNum);
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

  public onClickDeleteEventList(item: any) {
    console.log('onClickDeleteEventList', item);
    this.mainService.removeFavoritedEventList(item.slug).then((response) => {
      console.log('onClickDeleteEventList ====> response', response);
    });
  }

  public onClickDeletePlace(item: any) {
    console.log('onClickDeletePlace', item);
    this.mainService.favoritePlace(item.ids_no).then((response) => {
      console.log('onClickDeletePlace ====> response', response);
      if (response.error === 0) {
        this.userInfo.places.forEach((place, index) => {
          if (item === place) {
            delete this.userInfo.places[index];
            this.setPlace.offset--;
          }
        });
      }
    });
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

  public onScrollToBottom(event) {
    let elm = event.srcElement;
    if (elm.clientHeight + elm.scrollTop + elm.clientTop === elm.scrollHeight) {
      switch (this.selectedFavoriteType) {
        case 'event':
          this.getEvent(null, this.eventPageNum);
          break;
        case 'list':
          this.getList(null, this.listPageNum);
          break;
        case 'place':
          this.getPlace(null, this.placePageNum);
          break;
        default:
          break;
      }
    }

  }

  public ngOnInit() {
    this.canDelete = this.localStorageService.get('slug') ? true : false;
    this.getUserProfile(null);
    this.getEvent(null, this.eventPageNum);
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
    if (!this.setPlace.loadingInProgress) {
      this.setPlace.endOfList = false;
      this.setPlace.loadingInProgress = true;
      this.mainService.getUserPlace(slugName, page).then((response) => {
        console.log('====> getPlace response: ', response);
        if (response.total > 0) {
          if (response.total > this.setPlace.offset) {
            response.results.forEach((item) => {
              this.setPlace.offset++;
              this.userInfo.places.push(item);
            });
            this.placePageNum = Math.round(this.setPlace.offset / PAGE_SIZE);
          } else {
            this.setPlace.endOfList = true;
          }
        } else {
          this.setPlace.endOfList = true;
        }
        this.setPlace.loadingInProgress = false;
      });
    }
  }

  private getList(slugName?: string, page?: number) {
    if (!this.setList.loadingInProgress) {
      this.setList.endOfList = false;
      this.setList.loadingInProgress = true;
      this.mainService.getUserList(slugName, page).then((response) => {
        console.log('====> getList response: ', response);
        if (response.total > 0) {
          response.data.forEach((item) => {
            this.setList.offset++;
            this.userInfo.lists.push(item);
          });
          this.listPageNum = Math.round(this.setList.offset / PAGE_SIZE);
        } else {
          this.setList.endOfList = true;
        }
        this.setList.loadingInProgress = false;
      });
    }
  }

  private getEvent(slugName?: string, page?: number) {
    if (!this.setEvent.loadingInProgress) {
      this.setEvent.endOfList = false;
      this.setEvent.loadingInProgress = true;
      this.mainService.getUserEvent(slugName, page).then((response) => {
        console.log('====> getEvent response: ', response);
        if (response.length > 0) {
          response.forEach((item) => {
            this.setEvent.offset++;
            this.userInfo.events.push(item);
          });
          this.eventPageNum = Math.round(this.setEvent.offset / PAGE_SIZE);
        } else {
          this.setEvent.endOfList = true;
        }
        this.setEvent.loadingInProgress = false;
      });
    }
  }
}
