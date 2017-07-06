import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppSetting } from '../../app.setting';
import { LoaderService } from '../../helper/loader/loader.service';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import { User } from '../../app.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})

export class FavoriteComponent implements OnInit {
  public msgContent: any;
  public alertType: string;
  public user: any;
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
  public places = [];
  public lists = [];
  public events = [];
  public ready = false;
  private listPageNum: number = 0;
  private eventPageNum: number = 0;
  private placePageNum: number = 0;

  public constructor(private loaderService: LoaderService,
                     private mainService: MainService,
                     private userService: UserService,
                     private route: ActivatedRoute,
                     private localStorageService: LocalStorageService,
                     private smallLoader: SmallLoaderService) {
  }

  public ngOnInit() {
    this.selectedFavoriteType = 'event';
    this.user = this.localStorageService.get('user') as User;
    if (this.user) {
      this.smallLoader.show();
      this.loaderService.show();
      this.user.showNav = true;
      this.sub = this.route.params.subscribe(
        (params) => {
          this.slugName = params['slug'];
          this.getEvent(this.slugName, this.eventPageNum);
          this.canDelete = this.user.slug === this.slugName;
          this.userService.getUserProfile(this.slugName).subscribe(
            (user: User) => {
              this.user = user;
              this.ready = true;
            },
            (error) => {
              console.log(error);
            },
            () => {
              this.smallLoader.hide();
              this.loaderService.hide();
            });
      });
    }
  }

  public onSelectFavoriteType(type: string): void {
    this.selectedFavoriteType = type;
    switch (this.selectedFavoriteType) {
      case 'event':
        if (!this.setEvent.offset) {
          this.smallLoader.show();
          this.getEvent(this.slugName, this.eventPageNum);
        }
        break;
      case 'list':
        if (!this.setList.offset) {
          this.smallLoader.show();
          this.getList(this.slugName, this.listPageNum);
        }
        break;
      case 'place':
        if (!this.setPlace.offset) {
          this.smallLoader.show();
          this.getPlace(this.slugName, this.placePageNum);
        }
        break;
      default:
        break;
    }
  }

  public onClickDeleteEvent(item: any) {
    this.smallLoader.show();
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
          this.smallLoader.hide();
          this.alertType = 'success';
          this.msgContent = response.message;
        } else {
          this.smallLoader.hide();
          this.alertType = 'danger';
          this.msgContent = response.message;
        }
      }
    );
  }

  public onClickDeleteList(item: any) {
    this.smallLoader.show();
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
          this.smallLoader.hide();
          this.alertType = 'success';
          this.msgContent = response.message;
        } else {
          this.smallLoader.hide();
          this.alertType = 'danger';
          this.msgContent = response.message;
        }
      }
    );
  }

  public onClickDeletePlace(item: any) {
    this.smallLoader.show();
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
        this.smallLoader.hide();
        this.alertType = 'success';
        this.msgContent = response.message;
      } else {
        this.smallLoader.hide();
        this.alertType = 'danger';
        this.msgContent = response.message;
      }
    });
  }

  private getPlace(slugName?: string, page?: number) {
    if (!this.setPlace.loadingInProgress) {
      this.setPlace.endOfList = false;
      this.setPlace.loadingInProgress = true;
      this.userService.getUserPlace(slugName, page).subscribe(
        (response) => {
          if (response.total > 0) {
            this.smallLoader.hide();
            if (this.setPlace.offset < response.total) {
              response.results.forEach((item) => {
                this.setPlace.offset++;
                this.places.push(item);
              });
              this.smallLoader.hide();
              this.placePageNum = Math.round(this.setPlace.offset / AppSetting.PAGE_SIZE);
            } else {
              this.smallLoader.hide();
              this.setPlace.endOfList = true;
            }
          } else {
            this.smallLoader.hide();
            this.setPlace.endOfList = true;
          }
          this.smallLoader.hide();
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
              this.smallLoader.hide();
              this.listPageNum = Math.round(this.setList.offset / AppSetting.PAGE_SIZE);
            } else {
              this.smallLoader.hide();
              this.setList.endOfList = true;
            }
          } else {
            this.smallLoader.hide();
            this.setList.endOfList = true;
          }
          this.smallLoader.hide();
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
            this.eventPageNum = Math.round(this.setEvent.offset / AppSetting.PAGE_SIZE);
          } else {
            this.setEvent.endOfList = true;
          }
          this.smallLoader.hide();
          this.setEvent.loadingInProgress = false;
        }
      );
    }
  }
}
