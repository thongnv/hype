import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppSetting } from '../../app.setting';
import { SmallLoaderService } from '../../helper/small-loader/small-loader.service';
import { User } from '../../app.interface';
import { UserService } from '../../services/user.service';
import $ from "jquery";
@Component({
    selector: 'app-favorite',
    templateUrl: './favorite.component.html',
    styleUrls: ['./favorite.component.css']
})

export class FavoriteComponent implements OnInit {
    public msgContent:any;
    public alertType:string;
    public user = AppSetting.defaultUser;
    public currentUser:User;
    public favorite:any;
    public selectedFavoriteType:any;
    public isCurrentUser:boolean = false;
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
    public places = [];
    public lists = [];
    public events = [];
    public ready = false;
    private listPageNum:number = 0;
    private eventPageNum:number = 0;
    private placePageNum:number = 0;
    private loadMore:boolean = false;
    private end_record:boolean = false;

    public constructor(private mainService:MainService,
                       private userService:UserService,
                       private route:ActivatedRoute,
                       private localStorageService:LocalStorageService,
                       private smallLoader:SmallLoaderService) {
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
                this.userService.getUserProfile(this.slugName).subscribe(
                    (resp) => {
                        this.currentUser = resp.user;
                        this.ready = true;
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            }
        );

        $(window).scroll(()=> {
            //load more data
            if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                switch (this.selectedFavoriteType) {
                    case 'event':
                        if (this.loadMore == false && this.end_record == false) {
                            this.loadMore = true;
                            this.smallLoader.show();
                            this.getEvent(this.slugName, this.eventPageNum = this.eventPageNum + 1);
                        }
                        break;
                    case 'list':
                        if (this.loadMore == false && this.end_record == false) {
                            this.loadMore = true;
                            this.smallLoader.show();
                            this.getList(this.slugName, this.listPageNum = this.listPageNum + 1);
                        }
                        break;
                    case 'place':
                        if (this.loadMore == false && this.end_record == false) {
                            this.smallLoader.show();
                            this.loadMore = true;
                            this.getPlace(this.slugName, this.placePageNum = this.placePageNum + 1);
                        }
                        break;
                    default:
                        break;
                }


            }
        });
    }

    public onSelectFavoriteType(type:string):void {
        this.selectedFavoriteType = type;
        this.listPageNum =0;
        this.eventPageNum =0;
        this.placePageNum =0;
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

    public onClickDeleteList(item:any) {
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

    public onClickDeletePlace(item:any) {
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

    private getPlace(slugName?:string, page?:number) {
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
                                this.loadMore = false;
                            });
                            this.smallLoader.hide();
                            this.placePageNum = Math.round(this.setPlace.offset / AppSetting.PAGE_SIZE);
                        } else {
                            this.smallLoader.hide();
                            this.setPlace.endOfList = true;
                            this.end_record = true;
                        }
                    } else {
                        this.smallLoader.hide();
                        this.setPlace.endOfList = true;
                        this.end_record = true;
                    }
                    this.smallLoader.hide();
                    this.setPlace.loadingInProgress = false;
                }
            );
        }
    }

    private getList(slugName?:string, page?:number) {
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
                                this.loadMore = false;
                            });
                            this.smallLoader.hide();
                            this.listPageNum = Math.round(this.setList.offset / AppSetting.PAGE_SIZE);
                        } else {
                            this.smallLoader.hide();
                            this.setList.endOfList = true;
                            this.end_record = true;
                        }
                    } else {
                        this.smallLoader.hide();
                        this.setList.endOfList = true;
                        this.end_record = true;
                    }
                    this.smallLoader.hide();
                    this.setList.loadingInProgress = false;
                }
            );
        }
    }

    private getEvent(slugName?:string, page?:number) {
        if (!this.setEvent.loadingInProgress) {
            this.setEvent.endOfList = false;
            this.setEvent.loadingInProgress = true;
            this.smallLoader.show();
            this.userService.getUserEvent(slugName, page).subscribe(
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
                        this.end_record = true;
                    }
                    this.smallLoader.hide();
                    this.setEvent.loadingInProgress = false;
                }
            );
        }
    }
}
