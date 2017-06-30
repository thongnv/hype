import { Component,HostListener, OnInit,Inject } from '@angular/core';
import { AppState } from '../../app.service';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppSetting } from '../../app.setting';
import { LoaderService } from '../../shared/loader/loader.service';
import {SmallLoaderService} from "../../shared/small-loader/small-loader.service";
import { DOCUMENT } from "@angular/platform-browser";

@Component({
    selector: 'app-favorite',
    templateUrl: './favorite.component.html',
    styleUrls: ['./favorite.component.css']
})

export class FavoriteComponent implements OnInit {
    public msgContent:any;
    public alertType:string;
    public userInfo:any;
    public favorite:any;
    public selectedFavoriteType:any;
    public canDelete:boolean = false;
    public setList:any = {
        offset: 0, endOfList: false, loadingInProgress: false
    };
    public setPlace:any = {
        offset: 0, endOfList: false, loadingInProgress: false
    };
    public setEvent:any = {
        offset: 0, endOfList: false, loadingInProgress: false
    };
    public sub:any;
    public slugName:any;
    private listPageNum:number = 0;
    private eventPageNum:number = 0;
    private placePageNum:number = 0;

    public constructor(private appState:AppState,
                       private loaderService:LoaderService,
                       private mainService:MainService,
                       private route:ActivatedRoute,
                       private localStorageService:LocalStorageService,
                       private smallLoader:SmallLoaderService,
                       @Inject(DOCUMENT) private document:Document) {
        this.smallLoader.show();
        this.loaderService.show();
        this.selectedFavoriteType = 'event';

        this.userInfo = this.appState.state.userInfo;
        this.userInfo.showNav = true;
        this.userInfo.places = [];
        this.userInfo.lists = [];
        this.userInfo.events = [];
    }

    public onSelectFavoriteType(type:string):void {
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

    public onClickDeleteEvent(item:any) {
        this.smallLoader.show();
        this.mainService.removeFavoritedEventList(item.slug).then((response) => {
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

    public onClickDeleteList(item:any) {
        this.smallLoader.show();
        this.mainService.removeFavoritedEventList(item.slug).then((response) => {
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

    public onClickDeletePlace(item:any) {
        this.smallLoader.show();
        this.mainService.favoritePlace(item.ids_no).then((response) => {
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

  @HostListener("window:scroll", [])
  onWindowScroll() {
        let elm = event.srcElement;
    if (this.document.body.clientHeight + this.document.body.scrollTop === this.document.body.scrollHeight) {
            this.smallLoader.show();
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

    public ngOnInit() {
        this.sub = this.route.params.subscribe((params) => {
            this.slugName = params['slug'];
            this.getEvent(this.slugName, this.eventPageNum);
            this.canDelete = this.localStorageService.get('slug') === this.slugName;
            this.getUserProfile(this.slugName);
        });
    }

    private getUserProfile(slugName?:string):void {

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
            this.smallLoader.hide();
            this.loaderService.hide();
        });
    }

    private getPlace(slugName?:string, page?:number) {
        if (!this.setPlace.loadingInProgress) {
            this.setPlace.endOfList = false;
            this.setPlace.loadingInProgress = true;
            this.mainService.getUserPlace(slugName, page).then((response) => {
                if (response.total > 0) {
                    this.smallLoader.hide();
                    if (this.setPlace.offset < response.total) {
                        response.results.forEach((item) => {
                            this.setPlace.offset++;
                            this.userInfo.places.push(item);
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
            });
        }
    }

    private getList(slugName?:string, page?:number) {
        if (!this.setList.loadingInProgress) {
            this.setList.endOfList = false;
            this.setList.loadingInProgress = true;
            this.mainService.getUserList(slugName, page).then((response) => {
                if (response.total > 0) {
                    if (this.setList.offset < response.total) {
                        response.data.forEach((item) => {
                            this.setList.offset++;
                            this.userInfo.lists.push(item);
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
            });
        }
    }

    private getEvent(slugName?:string, page?:number) {
        if (!this.setEvent.loadingInProgress) {
            this.setEvent.endOfList = false;
            this.setEvent.loadingInProgress = true;
            this.mainService.getUserEvent(slugName, page).then((response) => {
                if (this.setEvent.offset < response.total) {
                    response.data.forEach((item) => {
                        this.setEvent.offset++;
                        this.userInfo.events.push(item);
                    });
                    this.smallLoader.hide();
                    this.eventPageNum = Math.round(this.setEvent.offset / AppSetting.PAGE_SIZE);
                } else {
                    this.smallLoader.hide();
                    this.setEvent.endOfList = true;
                }
                this.smallLoader.hide();
                this.setEvent.loadingInProgress = false;
            });
        }
    }
}
