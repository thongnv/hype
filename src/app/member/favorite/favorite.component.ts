import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppSetting } from '../../app.setting';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})

export class FavoriteComponent implements OnInit {
  public msgContent: any;
  public alertType: string;
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
  public sub: any;
  public slugName: any;
  private listPageNum: number = 0;
  private eventPageNum: number = 0;
  private placePageNum: number = 0;

  public constructor(private appState: AppState,
                     private loaderService: LoaderService,
                     private mainService: MainService,
                     private route: ActivatedRoute,
                     private localStorageService: LocalStorageService) {
    this.loaderService.show();
    this.selectedFavoriteType = 'event';

    this.userInfo = this.appState.state.userInfo;
    this.userInfo.showNav = true;
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

  public onClickDeleteEvent(item: any) {
    console.log('onClickDeleteEventList', item);
    this.mainService.removeFavoritedEventList(item.slug).then((response) => {
      console.log('onClickDeleteEvent ====> response', response);
      if (response.status) {
        this.userInfo.events.forEach((event, index) => {
          if (item === event) {
            delete this.userInfo.events[index];
            this.setEvent.offset--;
            if (this.setEvent.offset === 0) {
              this.setEvent.endOfList = true;
            }
          }
        });
        this.alertType = 'success';
        this.msgContent = response.message;
      } else {
        this.alertType = 'danger';
        this.msgContent = response.message;
      }
    });
  }

  public onClickDeleteList(item: any) {
    console.log('onClickDeleteList', item);
    this.mainService.removeFavoritedEventList(item.slug).then((response) => {
      console.log('onClickDeleteList ====> response', response);
      if (response.status) {
        this.userInfo.lists.forEach((list, index) => {
          if (item === list) {
            delete this.userInfo.lists[index];
            this.setList.offset--;
            if (this.setList.offset === 0) {
              this.setList.endOfList = true;
            }
          }
        });
        this.alertType = 'success';
        this.msgContent = response.message;
      } else {
        this.alertType = 'danger';
        this.msgContent = response.message;
      }
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
            if (this.setPlace.offset === 0) {
              this.setPlace.endOfList = true;
            }
          }
        });
        this.alertType = 'success';
        this.msgContent = response.message;
      } else {
        this.alertType = 'danger';
        this.msgContent = response.message;
      }
    });
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
    this.getEvent(null, this.eventPageNum);
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      console.log('USER: ', this.slugName);
      this.canDelete = this.localStorageService.get('slug') === this.slugName;
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
      this.loaderService.hide();
    });
  }

  private getPlace(slugName?: string, page?: number) {
    if (!this.setPlace.loadingInProgress) {
      this.setPlace.endOfList = false;
      this.setPlace.loadingInProgress = true;
      this.mainService.getUserPlace(slugName, page).then((response) => {
        console.log('====> getPlace response: ', response);
        if (response.total > 0) {
          if (this.setPlace.offset < response.total) {
            response.results.forEach((item) => {
              this.setPlace.offset++;
              this.userInfo.places.push(item);
            });
            this.placePageNum = Math.round(this.setPlace.offset / AppSetting.PAGE_SIZE);
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
          if (this.setList.offset < response.total) {
            response.data.forEach((item) => {
              this.setList.offset++;
              this.userInfo.lists.push(item);
            });
            this.listPageNum = Math.round(this.setList.offset / AppSetting.PAGE_SIZE);
          } else {
            this.setList.endOfList = true;
          }
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
        if (this.setEvent.offset < response.total) {
          response.data.forEach((item) => {
            this.setEvent.offset++;
            this.userInfo.events.push(item);
          });
          this.eventPageNum = Math.round(this.setEvent.offset / AppSetting.PAGE_SIZE);
        } else {
          this.setEvent.endOfList = true;
        }
        this.setEvent.loadingInProgress = false;
      });
    }
  }
}
