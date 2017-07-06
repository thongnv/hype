import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoaderService } from '../../helper/loader/loader.service';
import { User } from '../../app.interface';
import { AppSetting } from '../../app.setting';
import { UserService } from '../../services/user.service';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-profile-public',
  templateUrl: './profile-public.component.html',
  styleUrls: ['./profile-public.component.css']
})
export class ProfilePublicComponent implements OnInit {

  public user = AppSetting.defaultUser;
  public currentUser: User;
  public favorite: any;
  public selectedFavoriteType: any;
  public isCurrentUser: boolean = false;
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
  public followed: boolean = false;
  public ready = false;

  public events = [];
  public places = [];
  public lists = [];
  private listPageNum: number = 0;
  private eventPageNum: number = 0;
  private placePageNum: number = 0;

  public constructor(private loaderService: LoaderService,
                     private mainService: MainService,
                     private userService: UserService,
                     private route: ActivatedRoute,
                     private localStorageService: LocalStorageService) {
  }

  public ngOnInit() {
    this.loaderService.show();
    this.selectedFavoriteType = 'event';
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.sub = this.route.params.subscribe((params) => {
      this.slugName = params['slug'];
      this.isCurrentUser = this.user.slug === this.slugName;
      this.userService.getUserProfile(this.slugName).subscribe(
        (resp) => {
          this.currentUser = resp.user;
          this.followed = resp.followed;
          this.currentUser.showNav = false;
          this.ready = true;
          this.loaderService.hide();
        },
      );
      this.getEvent(this.slugName, this.eventPageNum);
    });
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
  }

  public onClickLike(item: any): void {
    this.favorite.forEach((fav, index) => {
      if (fav.id === item.id) {
        this.favorite[index] = item;
      }
    });
  }

  public onClickDeleteEvent(item: any) {
    this.userService.removeFavoritedEventList(item.slug).subscribe(
      (response) => {
        if (response.status) {
          this.events.forEach((event, index) => {
            if (item === event) {
              delete this.events[index];
              this.setEvent.offset--;
              if (this.setEvent.offset === 0) {
                this.setEvent.endOfList = true;
              }
            }
          });
        }
      }
    );
  }

  public onClickDeleteList(item: any) {
    this.userService.removeFavoritedEventList(item.slug).subscribe(
      (response) => {
        if (response.status) {
          this.lists.forEach((list, index) => {
            if (item === list) {
              delete this.lists[index];
              this.setList.offset--;
              if (this.setList.offset === 0) {
                this.setList.endOfList = true;
              }
            }
          });
        }
      }
    );
  }

  public onClickDeletePlace(item: any) {
    this.mainService.favoritePlace(item.ids_no).then((response) => {
      if (response.error === 0) {
        this.places.forEach((place, index) => {
          if (item === place) {
            delete this.places[index];
            this.setPlace.offset--;
            if (this.setPlace.offset === 0) {
              this.setPlace.endOfList = true;
            }
          }
        });
      }
    });
  }

  public onScrollToBottom(event) {
    let elm = event.srcElement;
    if (elm.clientHeight + elm.scrollTop + elm.clientTop === elm.scrollHeight) {
      switch (this.selectedFavoriteType) {
        case 'event':
          this.getEvent(this.slugName, this.eventPageNum);
          break;
        case 'list':
          this.getList(this.slugName, this.listPageNum);
          break;
        case 'place':
          this.getPlace(this.slugName, this.placePageNum);
          break;
        default:
          break;
      }
    }

  }

  private getPlace(slugName?: string, page?: number) {
    if (!this.setPlace.loadingInProgress) {
      this.setPlace.endOfList = false;
      this.setPlace.loadingInProgress = true;
      this.userService.getUserPlace(slugName, page).subscribe(
        (response) => {
          if (response.total > 0) {
            if (this.setPlace.offset < response.total) {
              response.results.forEach((item) => {
                this.setPlace.offset++;
                this.places.push(item);
              });
              this.placePageNum = Math.round(this.setPlace.offset / PAGE_SIZE);
            } else {
              this.setPlace.endOfList = true;
            }
          } else {
            this.setPlace.endOfList = true;
          }
          this.setPlace.loadingInProgress = false;
        }
      );
    }
  }

  private getList(slugName?: string, page?: number) {
    if (!this.setList.loadingInProgress) {
      this.setList.endOfList = false;
      this.setList.loadingInProgress = true;
      this.userService.getUserList(slugName, page).subscribe(
        (response) => {
          if (response.total > 0) {
            if (this.setList.offset < response.total) {
              response.data.forEach((item) => {
                this.setList.offset++;
                this.lists.push(item);
              });
              this.listPageNum = Math.round(this.setList.offset / PAGE_SIZE);
            } else {
              this.setList.endOfList = true;
            }
          } else {
            this.setList.endOfList = true;
          }
          this.setList.loadingInProgress = false;
        }
      );
    }
  }

  private getEvent(slugName?: string, page?: number) {
    if (!this.setEvent.loadingInProgress) {
      this.setEvent.endOfList = false;
      this.setEvent.loadingInProgress = true;
      this.userService.getUserEvent(slugName, page).subscribe(
        (response) => {
          if (this.setEvent.offset < response.total) {
            response.data.forEach((item) => {
              this.setEvent.offset++;
              this.events.push(item);
            });
            this.eventPageNum = Math.round(this.setEvent.offset / PAGE_SIZE);
          } else {
            this.setEvent.endOfList = true;
          }
          this.setEvent.loadingInProgress = false;
        }
      );
    }
  }
}
