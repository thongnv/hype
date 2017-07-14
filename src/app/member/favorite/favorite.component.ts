import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppSetting } from '../../app.setting';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import { User } from '../../app.interface';
import { UserService } from '../../services/user.service';
import $ from 'jquery';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})

export class FavoriteComponent implements OnInit {
  public msgContent: any;
  public alertType: string;
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
  public places = [];
  public lists = [];
  public events = [];
  public ready = false;
  private listPageNum: number = 0;
  private eventPageNum: number = 0;
  private placePageNum: number = 0;
  private loadMore: boolean = false;
  private endRecord: boolean = false;

  public constructor(private mainService: MainService,
                     private userService: UserService,
                     private route: ActivatedRoute,
                     private localStorageService: LocalStorageService,
                     private smallLoader: SmallLoaderService) {
  }

  public ngOnInit() {
    this.selectedFavoriteType = 'event';
    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.user.showNav = true;
    this.sub = this.route.params.subscribe(
      (params) => {
        this.slugName = params.slug;
        this.getEvent(this.slugName, this.eventPageNum);
        this.isCurrentUser = this.user.slug === this.slugName;
        this.userService.getProfile(this.slugName).subscribe(
          (resp) => {
            this.currentUser = resp;
            this.ready = true;
          },
          (error) => {
            console.log(error);
          }
        );
      }
    );

    $(window).scroll(() => {
      if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
        let type = this.selectedFavoriteType;
        if (!this.loadMore && !this.endRecord) {
          if (type === 'event') {
            this.loadMore = true;
            this.getEvent(this.slugName, this.eventPageNum);
          }
          if (type === 'list') {
            this.loadMore = true;
            this.getList(this.slugName, this.listPageNum);
          }
          if (type === 'place') {
            this.loadMore = true;
            this.getPlace(this.slugName, this.placePageNum);
          }
        }
      }
    });
  }

  public onSelectFavoriteType(type: string): void {
    this.selectedFavoriteType = type;
    this.listPageNum = 0;
    this.eventPageNum = 0;
    this.placePageNum = 0;
    if (type === 'event' && !this.setEvent.offset) {
      this.getEvent(this.slugName, this.eventPageNum);
    }
    if (type === 'list' && !this.setList.offset) {
      this.getList(this.slugName, this.listPageNum);
    }
    if (type === 'place' && !this.setPlace.offset) {
      this.getPlace(this.slugName, this.placePageNum);
    }
  }

  public onClickDeleteEvent(item: any) {
    this.smallLoader.show();
    this.userService.unFavoriteEventList(item.slug).subscribe(
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
          this.alertType = 'success';
        } else {
          this.alertType = 'danger';
        }
        this.msgContent = item.title + ' has been removed from your favorites';
        this.smallLoader.hide();
      }
    );
  }

  public onClickDeleteList(item: any) {
    this.smallLoader.show();
    this.userService.unFavoriteEventList(item.slug).subscribe(
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
          this.alertType = 'success';
        } else {
          this.alertType = 'danger';
        }
        this.msgContent = item.title + ' has been removed from your favorites';
        this.smallLoader.hide();
      }
    );
  }

  public onClickDeletePlace(item: any) {
    this.smallLoader.show();
    this.mainService.favoritePlace(item.ids_no).subscribe((response) => {
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
        this.alertType = 'success';
      } else {
        this.alertType = 'danger';
      }
      this.msgContent = item.company_name + ' has been removed from your favorites.';
      this.smallLoader.hide();
    });
  }

  private getPlace(slugName?: string, page?: number) {
    if (!this.setPlace.loadingInProgress) {
      this.setPlace.endOfList = false;
      this.setPlace.loadingInProgress = true;
      this.smallLoader.show();
      this.userService.getFavoritePlaces(slugName, page).subscribe(
        (response) => {
          if (response.total > 0) {
            if (this.setPlace.offset < response.total) {
              response.results.forEach((item) => {
                this.setPlace.offset++;
                this.places.push(item);
                this.loadMore = false;
              });
              this.placePageNum = Math.round(this.setPlace.offset / AppSetting.PAGE_SIZE);
            } else {
              this.setPlace.endOfList = true;
              this.endRecord = true;
            }
          } else {
            this.setPlace.endOfList = true;
            this.endRecord = true;
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
      this.smallLoader.show();
      this.userService.getLists(slugName, page).subscribe(
        (response) => {
          if (response.total > 0) {
            if (this.setList.offset < response.total) {
              response.data.forEach((item) => {
                this.setList.offset++;
                this.lists.push(item);
                this.loadMore = false;
              });
              this.listPageNum = Math.round(this.setList.offset / AppSetting.PAGE_SIZE);
            } else {
              this.setList.endOfList = true;
            }
          } else {
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
      this.smallLoader.show();
      this.userService.getEvents(slugName, page).subscribe(
        (response) => {
          if (this.setEvent.offset < response.total) {
            response.data.forEach((item) => {
              this.setEvent.offset++;
              this.events.push(item);
              this.loadMore = false;
            });
            this.eventPageNum = Math.round(this.setEvent.offset / AppSetting.PAGE_SIZE);
          } else {
            this.setEvent.endOfList = true;
            this.endRecord = true;
          }
          this.smallLoader.hide();
          this.setEvent.loadingInProgress = false;
        }
      );
    }
  }
}
