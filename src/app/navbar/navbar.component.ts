import { Component, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../app.service';
import { MainService } from '../services/main.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { NotificationComponent } from './notification/notification.component';
import * as io from 'socket.io-client';
import { AppSetting } from '../app.setting';
import { ProfileService } from '../services/profile.service';
import { User } from '../app.interface';
import { AppGlobals } from '../services/app.global';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public onSearch = false;
  public notifications: any;
  public neighbourhoods: string[];
  public selectedNeighbourhood: string;
  public notificationPage: number = 1;
  public totalUnread: number = 0;
  public totalPages: number = 0;
  public set: any = {
    offset: 0,
    endOfList: false,
    loadingInProgress: false
  };
  public user = AppSetting.defaultUser;

  @ViewChild(NotificationComponent)
  public NotificationComponent: NotificationComponent;

  private socket;

  public constructor(public appState: AppState,
                     private mainService: MainService,
                     private userService: UserService,
                     private localStorageService: LocalStorageService,
                     private router: Router,
                     private profileService: ProfileService,
                     public appGlobal: AppGlobals) {
  }

  public ngOnInit() {

    let user = this.localStorageService.get('user') as User;
    if (user) {
      this.user = user;
    }
    this.appState.set('notificationPage', this.notificationPage);
    this.neighbourhoods = AppSetting.NEIGHBOURHOODS;

    // Socket Notification
    let notificationPage = this.appState.state.notificationPage;
    if (notificationPage !== undefined) {
      this.notificationPage = notificationPage;
    }

    if (!this.user.isAnonymous) {
      this.socket = io(AppSetting.NODE_SERVER);
      this.socket.on('notification', (data) => {
        let check: boolean = false;
        for (let receiver of data.data.receivers) {
          if (this.user.id === receiver.uid) {
            check = true;
          }
        }
        if (check) {
          this.totalUnread = this.totalUnread + 1;
          this.notifications.unshift(data.data);
        }
      });
      this.getNotifications();
    }

    this.selectedNeighbourhood = 'Singapore';

    this.userService.getEmittedUser().subscribe(
      (data) => this.user = data
    );
    this.profileService.getEmittedValue().subscribe(
      (data) => {
        this.user.name = data.name;
        this.user.firstName = data.firstName;
        this.user.lastName = data.lastName;
        this.localStorageService.set('user', this.user);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public doToggleMap() {
    if (this.appGlobal.isShowLeft) {
      this.appGlobal.isShowLeft = false;
      this.appGlobal.isShowRight = true;

    } else {
      this.appGlobal.isShowLeft = true;
      this.appGlobal.isShowRight = false;
    }

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  public onSelectNeighbourhood(option: string): void {
    this.selectedNeighbourhood = option;
    this.appGlobal.setLocationAddress(option);
  }

  public mobile_searchState() {
    this.onSearch = !this.onSearch;
  }

  public mobile_createState() {
    this.onSearch = false;
  }

  public getNotifications() {
    this.mainService.getNotifications(this.user.id, this.notificationPage).subscribe((resp) => {
      this.totalUnread = resp.data.totalUnread;
      this.totalPages = resp.data.data.pages;
      this.notifications = resp.data.data.docs;
    });
  }

  public onMarkAllRead() {
    this.totalUnread = 0;
    this.mainService.updateNotifications(this.user.id, null).subscribe((resp) => {
      this.set.loadingInProgress = false;
    });
  }

  public onMarkOneRead(item) {
    if (this.totalUnread > 0) {
      this.totalUnread = this.totalUnread - 1;
    }
    this.mainService.updateNotifications(this.user.id, item._id).subscribe((resp) => {
      this.router.navigate([item.metadata.link]).then();
    });
  }

  public onScrollToBottom() {
    if (!this.set.loadingInProgress && this.notificationPage < this.totalPages) {
      this.set.endOfList = false;
      this.set.loadingInProgress = true;
      this.mainService.getNotifications(this.user.id, ++this.notificationPage).subscribe((response) => {
        if (response.data.data.docs.length) {
          response.data.data.docs.forEach((item) => {
            this.notifications.push(item);
          });
        }
        if (this.notificationPage >= this.totalPages) {
          this.set.endOfList = true;
        }
        this.set.loadingInProgress = false;
      });
    }
  }
}
